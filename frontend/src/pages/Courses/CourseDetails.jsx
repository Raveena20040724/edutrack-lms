import { useParams } from "react-router-dom";

function CourseDetails() {
  const { id } = useParams();

  return (
    <div>
      <h2>Course Details - {id}</h2>
    </div>
  );
}

export default CourseDetails;