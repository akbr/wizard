export default function createElementFromHTML(htmlString: string) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstElementChild as HTMLElement;
}
