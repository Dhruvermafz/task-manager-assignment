const isAdmin = (user) => {
  return (
    user.username === "dhruvermafz" &&
    user.email === "vermadhruv09112002@gmail.com" &&
    user.password === "dv@09112002"
  );
};

module.exports = isAdmin;
