import React, { useState, useRef, useEffect } from "react";
import { List, Avatar, message, Input, Space, Drawer, Layout } from "antd";
import dayjs from "dayjs";
import { enviarMensagemChat, MessagesChat } from "../../services/api";

interface ChatProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialMessages: MessagesChat[];
  refresh: () => void;
  id_teste: number;
}

const ChatComponent: React.FC<ChatProps> = ({
  visible,
  setVisible,
  initialMessages,
  refresh,
  id_teste,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [messageHistory, setMessageHistory] = useState<MessagesChat[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;

    const newMessage: MessagesChat = {
      id: 0,
      comentario: messageInput,
      usuario: "User",
      dataHora: new Date().toISOString(),
      id_teste: id_teste,
    };

    try {
      setLoading(true);
      const response = await enviarMensagemChat(newMessage);

      setMessageHistory([...messageHistory, newMessage]);

      setMessageInput("");

      message.success(response, 5);

      refresh();
    } catch (error) {
      message.error("Erro ao enviar mensagem", 5);
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setVisible(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messageHistory]);
  return (
    <Drawer title="Chat" placement="right" onClose={onClose} open={visible} width={500}>
      <Layout style={{ height: "100%", width: "100%" }}>
        <Layout.Content style={{ overflowY: "auto", padding: 5 }}>
          <List
            itemLayout="horizontal"
            dataSource={messageHistory}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar>{item.usuario[0]}</Avatar>}
                  title={item.usuario}
                  description={`${dayjs(item.dataHora).format("DD/MM/YYYY HH:mm")}`}
                />
                {item.comentario}
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} style={{ float: "left", clear: "both" }} />{" "}
        </Layout.Content>
        <Layout.Footer style={{ padding: 0, backgroundColor: "white", minWidth: "100%" }}>
          <Space direction="horizontal" style={{ minWidth: "100%" }}>
            <Input.Search
              placeholder="Digite sua mensagem"
              value={messageInput}
              onChange={handleInputChange}
              enterButton="Enviar"
              onSearch={handleSendMessage}
              style={{ minWidth: "150%" }}
              loading={loading}
            />
          </Space>
        </Layout.Footer>
      </Layout>
    </Drawer>
  );
};

export default ChatComponent;
