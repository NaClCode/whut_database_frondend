import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import { ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'
import '@/common/styles/index.scss'
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ConfigProvider 
            locale={zhCN}
            theme={{
                components: {
                  Table: {
                    rowHoverBg: "#eaeaea"
                  },
                }
              }}
        >
            <App/>
        </ConfigProvider>
    </BrowserRouter>
)

