import { MessageCircle, Sparkles, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function AIFeaturesShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-purple-600 text-white mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Features
          </Badge>
          <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
            Intelligent Shopping Experience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ghartak uses cutting-edge AI to help you shop smarter and help vendors grow their business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* AI Chat */}
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-xl group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-gray-900">AI Chat Assistant</h3>
              <p className="text-sm text-gray-600 mb-3">
                Get instant help finding products, tracking orders, and answering questions
              </p>
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                Powered by OpenAI
              </Badge>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-2 border-yellow-100 hover:border-yellow-300 transition-all hover:shadow-xl group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-gray-900">Smart Recommendations</h3>
              <p className="text-sm text-gray-600 mb-3">
                Discover products based on your preferences and popular local choices
              </p>
              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                Personalized for You
              </Badge>
            </CardContent>
          </Card>

          {/* Vendor Insights */}
          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-xl group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-gray-900">Vendor Analytics</h3>
              <p className="text-sm text-gray-600 mb-3">
                Comprehensive insights on sales, inventory, and customer trends
              </p>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                Business Intelligence
              </Badge>
            </CardContent>
          </Card>

          {/* Demand Prediction */}
          <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-xl group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-gray-900">Demand Forecasting</h3>
              <p className="text-sm text-gray-600 mb-3">
                AI-powered predictions help vendors plan inventory and reduce waste
              </p>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                7-Day Forecasts
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md border-2 border-purple-100">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="text-gray-700">
              <strong className="text-purple-600">New!</strong> Try our AI chat assistant - click the button in the bottom right
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
