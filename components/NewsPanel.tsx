import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, TrendingUp, AlertCircle, Minus, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import NewsModal from "./NewsModal";

export type News = {
    id: string;
    title: string;
    sentiment: string;
    summary: string;
    published_date: string;
    source: string;
    related_symbols: string[];
}

export default function NewsPanel({ news }: {news: News[]}) {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "negative":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-3 h-3" />;
      case "negative":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  return (
    <>
      <Card className="bg-[#141b2d] border-white/10">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Market News</h2>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[600px]">
          {news.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No news available</p>
            </div>
          ) : (
            news.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-white leading-tight flex-1 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`${getSentimentColor(item.sentiment)} flex items-center gap-1 shrink-0`}
                  >
                    {getSentimentIcon(item.sentiment)}
                    {item.sentiment}
                  </Badge>
                </div>

                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.summary}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(item.published_date), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {item.related_symbols && item.related_symbols.length > 0 && (
                    <div className="flex items-center gap-1">
                      {item.related_symbols.slice(0, 3).map((symbol) => (
                        <Badge
                          key={symbol}
                          variant="outline"
                          className="text-xs border-blue-500/30 text-blue-400"
                        >
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <NewsModal
        news={selectedNews}
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
      />
    </>
  );
}