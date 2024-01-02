type NullableString = string | null;

export class DftIds {
  #from: NullableString;
  #to: NullableString;
  #previewTo: NullableString;

  constructor() {
    this.#from = null;
    this.#to = null;
    this.#previewTo = null;
  }
  setFrom(fromId: string) {
    this.#from = fromId;
  }
  resetFrom() {
    this.#from = null;
  }
  setTo(toId: string) {
    this.#to = toId;
  }
  resetTo() {
    this.#to = null;
  }
  setPreviewTo(previewToId: string) {
    this.#previewTo = previewToId;
  }
  resetPreviewTo() {
    this.#to = null;
  }
  getIds() {
    return {
      from: this.#from,
      to: this.#to,
      previewTo: this.#previewTo,
    };
  }
  reset() {
    this.#from = null;
    this.#to = null;
    this.#previewTo = null;
  }
}
