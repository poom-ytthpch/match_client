import Old from "./old";
import Default from "./default";
import Mqtt from "./mqtt";

const boards = ({ boards }) => {
  return (
    <div>
      {boards.map((i) => {
        switch (i.type) {
          case "OLD":
            return <Old key={i.b_id} board={i} />;
          case "DEFAULT":
            return <Default key={i.b_id} board={i} />;
          case "MQTT":
            return <Mqtt key={i.device_id} board={i} />;
        }
      })}
    </div>
  );
};

export default boards;
