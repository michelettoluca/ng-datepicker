import { Directive, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({
    selector: "[ngl-click-outside]",
})
export class NglClickOutside {
    constructor(private elementRef: ElementRef) {
    }

    @Output() public onClickOutside = new EventEmitter();

    @HostListener("document:click", ["$event"])
    handleClickOutside(event: PointerEvent) {
        if (!event.composedPath().includes(this.elementRef.nativeElement)) {
            this.onClickOutside.emit();
        }
    }
}
