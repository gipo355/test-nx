export const bodyClass = (node: HTMLBodyElement, className: string) => {
  node.classList.add(className);

  return {
    update(newClassName: string) {
      node.classList.remove(className);
      // eslint-disable-next-line no-param-reassign
      className = newClassName;
      node.classList.add(className);
    },
    destroy() {
      node.classList.remove(className);
    },
  };
};
// to use with action and store
// <svelte:body use:bodyClass={$preferences.theme} />
