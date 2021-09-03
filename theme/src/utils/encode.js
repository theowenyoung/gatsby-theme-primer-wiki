export const encodeSlug = (slug) => {
  if (slug) {
    return slug
      .split("/")
      .map((item) => encodeURIComponent(item))
      .join("/");
  } else {
    return slug;
  }
};
