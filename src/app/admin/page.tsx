"use client";

import { useEffect, useState } from "react";
import Header from "@/include/Header";
import {
  PageWrapper,
  MainContentWrapper,
  Content,
  H1,
} from "@/styled/Admin.styles";
import SideBar from "./include/SideBar";

const API_ROOT = "http://localhost:9999";
const API_BASE = `${API_ROOT}/api`;

type Summary = {
  todayRevenue: number;
  todayOrders: number;
  newMembers: number;
  pendingInquiries: number;
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/admin/dashboard/daily-summary`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("dashboard 로딩 실패");

      const data = await res.json();
      console.log("dashboard:", data);
      setSummary(data);
    } catch (err) {
      console.error("dashboard 에러", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <PageWrapper>
      <SideBar />

      <MainContentWrapper>
        <Header />

        <Content>
          <H1>Dashboard</H1>

          {!summary && <p>로딩중...</p>}

          {summary && (
            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
              <Card title="오늘 매출" value={`${summary.todayRevenue.toLocaleString()}원`} />
              <Card title="오늘 주문" value={`${summary.todayOrders}건`} />
              <Card title="신규 회원" value={`${summary.newMembers}명`} />
              <Card title="문의" value={`${summary.pendingInquiries}건`} />
            </div>
          )}
        </Content>
      </MainContentWrapper>
    </PageWrapper>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        width: "200px",
        textAlign: "center",
        background: "#fff",
      }}
    >
      <h4>{title}</h4>
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}