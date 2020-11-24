import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

function isArray(v) {
  return Array.isArray(v);
}

function isPrimitive(v) {
  return ["number", "boolean", "string"].includes(typeof v);
}

const MAX_WIDTH_CHARS = 60;
const DEPTH_WIDTH = 5;

export default class EntryViewerComponent extends Component {
  @tracked
  isExpanded = true;

  get isToggleable() {
    if (this.showInline) {
      return false;
    }
    let v = this.args.value;
    return typeof v === "object";
  }

  get showInline() {
    if (!isArray(this.args.value)) {
      return false;
    }
    let allPrims = this.args.value.every((v) => isPrimitive(v));
    if (!allPrims) {
      return false;
    }
    let width = JSON.stringify(this.args.value).length;
    width += this.args.depth * DEPTH_WIDTH;
    return width < MAX_WIDTH_CHARS;
  }

  @action
  toggleExpanded() {
    if (!this.isToggleable) {
      return;
    }
    this.isExpanded = !this.isExpanded;
  }
}
