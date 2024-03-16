const Part = ({ part, i }) => {
  return (
    <p key={i}>
      {part.name} {part.exercises}
    </p>
  );
};

export default Part;
