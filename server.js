const server = (app) => {
  app.listen(process.env.PORT || 3000, (err) => {
    if (err) throw new Error(err);
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

export default server;
