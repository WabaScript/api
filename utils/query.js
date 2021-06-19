const fetchOrCreate = async (instance, payload) => {
  const fetched = await instance.where(payload).fetch({ require: false });

  if (fetched) {
    return fetched;
  }

  return new instance(payload).save();
};

module.exports = { fetchOrCreate };
