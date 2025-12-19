import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import AppSidebar, { mobileNavItems } from "@/components/AppSidebar";
import FloatingFoodDecorations from "@/components/FloatingFoodDecorations";

interface MainLayoutProps {
  children: ReactNode;
  showDecorations?: boolean;
}

const MainLayout = ({ children, showDecorations = true }: MainLayoutProps) => {
  const location = useLocation();

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[hsl(68,60%,95%)] to-[hsl(68,50%,88%)] overflow-hidden flex">
      {/* Floating Decorative Elements */}
      {showDecorations && <FloatingFoodDecorations />}

      {/* Independent Sidebar - sits on the background */}
      <div className="relative z-20">
        <AppSidebar />
      </div>

      {/* Main Glass Card Container */}
      <div className="flex-1 p-4 md:my-4 md:mr-4 relative z-10">
        <div className="h-full w-full bg-background/60 backdrop-blur-xl rounded-[40px] shadow-2xl border border-border/50 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border/30 py-3 px-4 flex justify-around z-50">
        {mobileNavItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MainLayout;
