import React from "react";

import { Spin } from "antd";

const LoadingPage = () => {
  return <Spin fullscreen tip="Carregando..." size="large" />;
};

export default LoadingPage;
