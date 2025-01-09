import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Renderer2,
  ElementRef,
  Output,
  OnInit,
} from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { throttleTime } from "rxjs/operators";

@Directive({
  selector: "[appPreventDoubleClick]",
})
export class PreventDoubleClickDirective implements OnInit {
  @Input()
  throttleTime = 3000;

  @Input()
  reenableButton: EventEmitter<boolean> | undefined;

  @Output()
  throttledClick = new EventEmitter();

  private clicks = new Subject();
  private subscription: Subscription | undefined;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    if (!this.reenableButton) {
      this.subscription = this.clicks
        .pipe(throttleTime(this.throttleTime))
        .subscribe((e) => {
          console.log("enable");
          // this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
          this.emitThrottledClick(e);
        });
    } else {
      this.subscription = this.reenableButton.subscribe((isEnableButton) => {
        console.log("enable");
        if (isEnableButton) {
          setTimeout(
            () =>
              this.renderer.removeAttribute(this.el.nativeElement, "disabled"),
            0,
          );
          // this.emitThrottledClick(true);
        }
      });
    }
  }

  emitThrottledClick(e: any) {
    this.throttledClick.emit(e);
  }

  @HostListener("click", ["$event"])
  clickEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.reenableButton) {
      console.log("event mode");
      this.emitThrottledClick(true);
      this.renderer.setAttribute(this.el.nativeElement, "disabled", "true");
    }
    console.log("click");
    this.clicks.next(event);
  }
}
