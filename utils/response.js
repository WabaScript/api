const format = (data, args) => {
  return {
    data: data,
    ...args,
  };
};

module.exports = { format };
