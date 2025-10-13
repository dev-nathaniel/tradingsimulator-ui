import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Newspaper, TrendingUp, AlertCircle, Minus, Calendar, Building } from "lucide-react";
import { format } from "date-fns";
import { News } from "./NewsPanel";

export default function NewsModal({ news, isOpen, onClose }: { news: News | null; isOpen: boolean; onClose: () => void;}) {
  if (!news) return null;

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
        return <TrendingUp className="w-4 h-4" />;
      case "negative":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#141b2d] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
              <Newspaper className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl leading-tight mb-2">
                {news.title}
              </DialogTitle>
              <Badge
                variant="outline"
                className={`${getSentimentColor(news.sentiment)} flex items-center gap-1 w-fit`}
              >
                {getSentimentIcon(news.sentiment)}
                {news.sentiment} sentiment
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Building className="w-4 h-4" />
              <span>{news.source}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(news.published_date), "MMMM d, yyyy 'at' h:mm a")}</span>
            </div>
          </div>

          {/* Related Symbols */}
          {news.related_symbols && news.related_symbols.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Related Stocks</h4>
              <div className="flex flex-wrap gap-2">
                {news.related_symbols.map((symbol) => (
                  <Badge
                    key={symbol}
                    variant="outline"
                    className="border-blue-500/30 text-blue-400 bg-blue-500/10"
                  >
                    {symbol}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-[#0a0e27] rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Summary</h4>
            <p className="text-gray-300 leading-relaxed">{news.summary}</p>
          </div>

          {/* Additional Context */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-xs text-gray-500">
              This is a simulated news article for demonstration purposes. 
              In a real trading platform, this would link to the full article from {news.source}.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}