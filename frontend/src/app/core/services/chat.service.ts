import { Injectable, signal, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

export interface IMessage {
  _id: string;
  movieId: string;
  userId: string;
  username: string;
  content: string;
  userPhotoUrl?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService implements OnDestroy {
  private socket: Socket | null = null;

  messages = signal<IMessage[]>([]);
  connected = signal(false);

  connect() {
    if (this.socket?.connected) return;
    const baseUrl = environment.apiUrl.replace('/api', '');
    this.socket = io(baseUrl, { withCredentials: true });

    this.socket.on('connect', () => this.connected.set(true));
    this.socket.on('disconnect', () => this.connected.set(false));
    this.socket.on('messages-history', (msgs: IMessage[]) => this.messages.set(msgs));
    this.socket.on('new-message', (msg: IMessage) =>
      this.messages.update(prev => [...prev, msg])
    );
  }

  joinRoom(movieId: string) {
    this.messages.set([]);
    this.socket?.emit('join-room', movieId);
    this.socket?.emit('load-messages', movieId);
  }

  sendMessage(movieId: string, username: string, content: string) {
    this.socket?.emit('send-message', { movieId, username, content });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.connected.set(false);
    this.messages.set([]);
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
