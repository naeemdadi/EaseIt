import "./message.css";
import moment from "moment";
import { Avatar } from "@material-ui/core";
import { deepOrange, deepPurple } from "@material-ui/core/colors";

export default function Message({ message, own, sender }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {sender.profilePic ? (
          <Avatar
            alt={sender.name}
            src={sender?.profilePic}
            style={{ marginRight: "10px" }}
          />
        ) : (
          <Avatar
            style={{
              marginRight: "10px",
              fontSize: "12px",
              backgroundColor: own ? deepPurple[500] : deepOrange[500],
            }}
          >
            {sender.name.split(" ")[0]}
          </Avatar>
        )}
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{moment(message.createdAt).fromNow()}</div>
    </div>
  );
}
