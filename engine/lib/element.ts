export function getElementCSSSelector(element: HTMLElement) {
  const cssSelector: string[] = [];
  let parent: HTMLElement | null = element;
  while (parent !== null) {
    cssSelector.push(representElementAsCSS(parent));
    parent = parent.parentElement;
  }

  return cssSelector.reverse().join(" ");
}

export function representElementAsCSS(element: HTMLElement | null) {
  if (!element) {
    return "";
  }

  // TODO: récuperer les data-attributes

  const tag = element.tagName.toLocaleLowerCase();
  const id = element.id;
  const classes = [...element.classList]
    .map((cssClass) => `.${cssClass}`)
    .join("");

  return tag + (id ? `#${id}` : "") + classes;
}
