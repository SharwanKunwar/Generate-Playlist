import { InputNumber, Space, Typography, Card } from "antd";
import { useState, useEffect } from "react";

const { Text } = Typography;

function DurationInput({ onChange }) {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    // convert to total minutes
    useEffect(() => {
        const total = hours * 60 + minutes;
        onChange && onChange(total);
    }, [hours, minutes, onChange]);

    return (
        <Card
            className="w-full"
        >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>

                <h3 className=" text-xl text-neutral-500 text-start">⏱️ Custom Duration</h3>

                <Space className="">
                    <section className="flex gap-3 justify-center items-center">
                        <Text className="text-xl font-medium">Hour </Text>
                        <InputNumber
                            size="large"
                            min={0}
                            max={3}
                            value={hours}
                            onChange={(val) => setHours(val || 0)}
                            className=" h-[10vh] w-[70px] text-4xl hide-caret center-input"

                        />
                    </section>

                    <section className="flex gap-3 justify-center items-center">
                        <Text className="text-xl">min </Text>
                        <InputNumber
                            min={0}
                            max={59}
                            value={minutes}
                            onChange={(val) => setMinutes(val || 0)}
                            className=" h-[10vh] text-4xl hide-caret center-input"
                        />
                    </section>
                </Space>

                <p type="secondary" className="text-end text-neutral-400">
                    Total: {hours * 60 + minutes} minutes
                </p>

            </Space>
        </Card>
    );
}

export default DurationInput;
