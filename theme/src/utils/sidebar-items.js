export const getSidebarItems = (sidebarItems, tagsGroups) => {
  return sidebarItems.length > 0
    ? sidebarItems
    : tagsGroups.length > 0
    ? [
        {
          title: "Tags",
          items: tagsGroups,
        },
      ]
    : [];
};
