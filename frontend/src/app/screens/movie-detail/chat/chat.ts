import { Component, inject, signal, computed, OnInit, OnDestroy, ViewChild, ElementRef, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatService } from '../../../core/services/chat.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  @ViewChild('messagesList') messagesListEl!: ElementRef<HTMLDivElement>;

  messages = this.chatService.messages;
  connected = this.chatService.connected;
  inputText = signal('');
  currentUser = signal<{ id: string; name: string } | null>(null);
  userPhoto = signal<string | null>(null);
  loadingUser = signal(true);

  userScrolledUp = false;
  unreadCount = 0;
  private readonly NEAR_BOTTOM_THRESHOLD = 100;
  private isScrollingProgrammatically = false;

  canSend = computed(() =>
    this.inputText().trim().length > 0 &&
    this.inputText().length <= 500 &&
    this.connected() &&
    this.currentUser() !== null
  );

  constructor() {
    effect(() => {
      const msgs = this.messages();
      if (msgs.length > 0 && this.userScrolledUp) {
        this.unreadCount++;
      }
      setTimeout(() => this.scrollToBottomIfNeeded(), 0);
    });
  }

  ngOnInit() {
    this.userService.userPhoto$.subscribe({
      next: (photoUrl) => {
        this.userPhoto.set(photoUrl);
      },
    });

    this.userService.getMe().subscribe({
      next: (user) => {
        this.currentUser.set({ id: user.id, name: user.name });
        this.loadingUser.set(false);
        this.initChat();
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
        this.loadingUser.set(false);
      },
    });

    this.userService.getProfile().subscribe({
      next: (user) => {
        this.userService.setUserPhoto(user.photoUrl ?? null);
      },
      error: () => {
        this.userService.setUserPhoto(null);
      },
    });
  }

  private initChat() {
    this.chatService.connect();
    const movieId = this.route.parent!.snapshot.params['id'];
    if (movieId) {
      this.chatService.joinRoom(movieId);
    }
  }

  sendMessage() {
    if (!this.canSend()) return;

    const movieId = this.route.parent!.snapshot.params['id'];
    const username = this.currentUser()!.name;
    const content = this.inputText().trim();

    this.chatService.sendMessage(movieId, username, content);
    this.inputText.set('');
  }

  onScroll(): void {
    if (this.isScrollingProgrammatically) return;
    const el = this.messagesListEl?.nativeElement;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    this.userScrolledUp = distanceFromBottom > this.NEAR_BOTTOM_THRESHOLD;
    if (!this.userScrolledUp) {
      this.unreadCount = 0;
    }
  }

  scrollToBottom(): void {
    this.userScrolledUp = false;
    this.unreadCount = 0;
    this.programmaticScroll();
  }

  private scrollToBottomIfNeeded(): void {
    if (this.userScrolledUp) return;
    this.programmaticScroll();
  }

  private programmaticScroll(): void {
    const el = this.messagesListEl?.nativeElement;
    if (!el) return;

    this.isScrollingProgrammatically = true;

    const checkIfFinished = () => {
      const atBottom =
        Math.abs(el.scrollTop + el.clientHeight - el.scrollHeight) < 2;

      if (atBottom) {
        this.isScrollingProgrammatically = false;
        el.removeEventListener('scroll', checkIfFinished);
      }
    };

    el.addEventListener('scroll', checkIfFinished);

    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
