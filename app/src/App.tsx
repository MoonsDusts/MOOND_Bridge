import BridgeCard from "./components/BridgeCard";
import NotifyCard from "./components/NotifyCard";

export function App() {
  return (
    <div className="flex flex-col items-center mt-[60px] space-y-[10px]">
      <NotifyCard />
      <BridgeCard />
    </div>
  );
}
