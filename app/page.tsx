"use client";
import StockList, { Stock } from "@/components/StockList";
import StockDetails from "@/components/StockDetails";
import PositionsPanel, { Position } from "@/components/PositionsPanel";
import NewsPanel from "@/components/NewsPanel";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserType } from "@/components/AuthModal";

export default function Home({ user, isAuthenticated, onLogin}: {user: UserType | null, isAuthenticated: boolean, onLogin: () => void}) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    // const [user, setUser] = useState(null)

  // const stocks = [
  //   {
  //     symbol: "AAPL",
  //     name: "Apple Inc.",
  //     current_price: 150.25,
  //     previous_close: 148.50,
  //     sector: "Technology",
  //     id: "1",
  //     volume: 100000,
  //     market_cap: 2500000000,
  //     pe_ratio: 28.5,
  //     dividend_yield: 0.6,
  //   }
  // ]; // Fetch or load your stocks data here
  // const positions = [
  //   {
  //     id: "pos1",
  //     stock_symbol: "AAPL",
  //     quantity: 50,
  //     average_price: 145.00,
  //     stock_name: "Apple Inc.",
  //   }
  // ]; // Fetch or load your positions data here
  // const news = [
  //   {
  //     id: "news1",
  //     title: "Apple Releases New iPhone Model",
  //     sentiment: "positive",
  //     summary: "Apple has announced the release of its latest iPhone model, featuring advanced technology and improved performance.",
  //     published_date: new Date().toISOString(),
  //     source: "Tech News Daily",
  //     related_symbols: ["AAPL"],
  //   }
  // ]; // Fetch or load your news data here
  // const isProcessing = false; // Example state for processing trades
  // const userPosition = null; // Example state for user's position

  // Queries
  const { data: stocks = [], isLoading: stocksLoading } = useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8080/api/v1/stocks', {method: 'GET', headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbG93b28iLCJpYXQiOjE3NjA2OTQzODAsImV4cCI6MTc2MDc4MDc4MH0.EqZsOg1kGHVRByD4m-XBF55eSJT41VqHWB8y6cowePM`
      }});
      return await res.json();
    }
  });

  console.log("Stocks data:", stocks);

  console.log("positions user token", user);
  const { data: positions = [], isLoading: positionsLoading } = useQuery({
    queryKey: ['positions', user?.token],
    enabled: !!user?.token,
    queryFn: async () => {
      console.log("Fetching positions with user token:", user?.token);
      const res = await fetch('http://localhost:8080/api/v1/positions', {method: 'GET', headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      }});
      const jsonRes = await res.json();
      console.log("Positions data:", jsonRes);
      return jsonRes;
    }
  });

  console.log("Positions data:", positions);

  const { data: news = [], isLoading: newsLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8080/api/v1/news', {method: 'GET', headers: {
        'Content-Type': 'application/json',
      }});
      return await res.json();
    }
  });

  // Mutation for executing trades (positions)
  const queryClient = useQueryClient();
  const executeTradeMutation = useMutation({
    mutationFn: async (trade: { positionType: "buy" | "sell"; stock_id: number; positionVolume: number; user_id: number, positionAvgPrice: number; }) => {
      const res = await fetch('http://localhost:8080/api/v1/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
        body: JSON.stringify(trade),
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    }
  });

  const handleExecuteTrade = (trade: { positionType: "buy" | "sell"; positionVolume: number; positionAvgPrice: number; }) => {
    if (!selectedStock) return;
    if (!user) return;
    executeTradeMutation.mutate({
      ...trade,
      stock_id: selectedStock.id,
      user_id: user.id,
    });
  };

  const isProcessing = executeTradeMutation.isPending;
  const userPosition = selectedStock ? positions.find((p: Position) => p.stock.stockCode === selectedStock?.stockCode) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column - Stocks List */}
      <div className="lg:col-span-3">
        <StockList
          stocks={stocks}
          selectedStock={selectedStock}
          onSelectStock={setSelectedStock}
        />
      </div>

      {/* Middle Column - Stock Details */}
      <div className="lg:col-span-5">
        <StockDetails
          stock={selectedStock}
          // onExecuteTrade={handleExecuteTrade}
          isProcessing={isProcessing}
          userPosition={userPosition}
          isAuthenticated={isAuthenticated}
          onLogin={onLogin}
          user={user}
        />
      </div>

      {/* Right Column - Positions & News */}
      <div className="lg:col-span-4 space-y-6">
        <PositionsPanel positions={positions} stocks={stocks} />
        <NewsPanel news={news} />
      </div>
    </div>
  );
}
