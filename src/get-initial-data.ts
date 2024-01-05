let uniqueId = 0;
function getItems(count: number) {
  return Array.from({ length: count }, () => {
    const id = uniqueId++;
    return {
      id: `id:${id}`,
      title: `item ${id} TODO TODOf fdf TODOef dfdf efdf sdfsfd fdfdfd`
    };
  });
}

const initial: any = {
  columns: {
    "column-0": {
      id: "column-0",
      title: "TODO",
      items: getItems(1000)
    },
    "column-1": {
      id: "column-1",
      title: "ONGOING",
      items: getItems(1000)
    },
    "column-2": {
      id: "column-2",
      title: "DONE",
      items: getItems(1000)
    }
  },
  columnOrder: ["column-0", "column-1", "column-2"]
};

export default function getInitialData() {
  return initial;
}
