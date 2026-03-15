"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Card } from "react-bootstrap";

const API_ROOT = "http://localhost:9999";
const API_BASE = `${API_ROOT}/api`;

export default function ProductPage() {

  const [products, setProducts] = useState<any[]>([]);

  // 4️⃣ /api/products fetch
  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <Container className="mt-4">

      <h1 className="mb-4">상품 목록</h1>

      <Row>

        {/* 5️⃣ 카드 렌더링 */}
        {products.map((p) => (

          <Col md={4} key={p.id} className="mb-4">

            <Link href={`/product/${p.id}`} style={{ textDecoration: "none" }}>

              <Card style={{ cursor: "pointer" }}>

                <Card.Img
                  variant="top"
                  src={`${API_ROOT}${p.imageUrl}`}
                  style={{ height: 200, objectFit: "cover" }}
                />

                <Card.Body>

                  <Card.Title>
                    {p.title}
                  </Card.Title>

                  <Card.Text>
                    {p.price?.toLocaleString()}원
                  </Card.Text>

                </Card.Body>

              </Card>

            </Link>

          </Col>

        ))}

      </Row>

    </Container>
  );
}