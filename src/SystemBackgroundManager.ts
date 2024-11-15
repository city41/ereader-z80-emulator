class _SystemBackgroundManager {
  private emptyImage = document.createElement("img");
  private backgrounds: Record<number, HTMLImageElement> = {};

  setBackgrounds(backgrounds: Record<number, HTMLImageElement>) {
    this.backgrounds = backgrounds;
  }

  getBackground(id: number): HTMLImageElement {
    return this.backgrounds[id] ?? this.emptyImage;
  }
}

const SystemBackgroundManager = new _SystemBackgroundManager();

export { SystemBackgroundManager };
