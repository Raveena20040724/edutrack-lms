import { useParams } from "react-router-dom";

function VideoPlayer() {
  const { id } = useParams();

  return (
    <div>
      <h2>Video Player - Lesson {id}</h2>
    </div>
  );
}

export default VideoPlayer;