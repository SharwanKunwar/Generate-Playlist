import { Card, List } from "antd";
import { formatTime } from "../utils/time";

export default function Playlist({ segments }) {
  return (
    <Card title="📚 Playlist" className="shadow-lg max-h-[600px] overflow-y-scroll">
      <List
        dataSource={segments}
        renderItem={(seg, index) => (
          <List.Item
            onClick={() => window.seekTo(seg.start)}
            className="cursor-pointer hover:bg-gray-100 rounded px-2"
          >
            <div className=" w-full text-start">
              <strong>Part {index + 1}</strong>
              <div className="text-sm text-gray-500">
                {formatTime(seg.start)} - {formatTime(seg.end)}
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}