import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Station = {
  id: string;
  name: string;
  lineName: string;
  ward: string;
  visited: boolean;
  visitedAt?: string;
  memo?: string;
};

const STORAGE_KEY = "eki-stamp-log-stations";

const MASTER_STATIONS: Omit<Station, "visited" | "visitedAt" | "memo">[] = [
  { id: "tokyo", name: "東京", lineName: "JR山手線・中央線・京浜東北線ほか", ward: "千代田区" },
  { id: "yurakucho", name: "有楽町", lineName: "JR山手線・京浜東北線", ward: "千代田区" },
  { id: "shimbashi", name: "新橋", lineName: "JR山手線・京浜東北線・東海道線ほか", ward: "港区" },
  { id: "hamamatsucho", name: "浜松町", lineName: "JR山手線・京浜東北線", ward: "港区" },
  { id: "tamachi", name: "田町", lineName: "JR山手線・京浜東北線", ward: "港区" },
  { id: "takanawa-gateway", name: "高輪ゲートウェイ", lineName: "JR山手線・京浜東北線", ward: "港区" },
  { id: "shinagawa", name: "品川", lineName: "JR山手線・京浜東北線・東海道線ほか", ward: "港区" },
  { id: "osaki", name: "大崎", lineName: "JR山手線・埼京線・湘南新宿ライン", ward: "品川区" },
  { id: "gotanda", name: "五反田", lineName: "JR山手線", ward: "品川区" },
  { id: "meguro", name: "目黒", lineName: "JR山手線", ward: "品川区" },
  { id: "ebisu", name: "恵比寿", lineName: "JR山手線・埼京線・湘南新宿ライン", ward: "渋谷区" },
  { id: "shibuya", name: "渋谷", lineName: "JR山手線・埼京線・湘南新宿ライン", ward: "渋谷区" },
  { id: "harajuku", name: "原宿", lineName: "JR山手線", ward: "渋谷区" },
  { id: "yoyogi", name: "代々木", lineName: "JR山手線・中央・総武線", ward: "渋谷区" },
  { id: "shinjuku", name: "新宿", lineName: "JR山手線・中央線・埼京線ほか", ward: "新宿区" },
  { id: "shin-okubo", name: "新大久保", lineName: "JR山手線", ward: "新宿区" },
  { id: "takadanobaba", name: "高田馬場", lineName: "JR山手線", ward: "新宿区" },
  { id: "mejiro", name: "目白", lineName: "JR山手線", ward: "豊島区" },
  { id: "ikebukuro", name: "池袋", lineName: "JR山手線・埼京線・湘南新宿ライン", ward: "豊島区" },
  { id: "otsuka", name: "大塚", lineName: "JR山手線", ward: "豊島区" },
  { id: "sugamo", name: "巣鴨", lineName: "JR山手線", ward: "豊島区" },
  { id: "komagome", name: "駒込", lineName: "JR山手線", ward: "豊島区" },
  { id: "tabata", name: "田端", lineName: "JR山手線・京浜東北線", ward: "北区" },
  { id: "nishi-nippori", name: "西日暮里", lineName: "JR山手線・京浜東北線", ward: "荒川区" },
  { id: "nippori", name: "日暮里", lineName: "JR山手線・京浜東北線・常磐線", ward: "荒川区" },
  { id: "uguisudani", name: "鶯谷", lineName: "JR山手線・京浜東北線", ward: "台東区" },
  { id: "ueno", name: "上野", lineName: "JR山手線・京浜東北線・宇都宮線ほか", ward: "台東区" },
  { id: "okachimachi", name: "御徒町", lineName: "JR山手線・京浜東北線", ward: "台東区" },
  { id: "akihabara", name: "秋葉原", lineName: "JR山手線・京浜東北線・中央・総武線", ward: "千代田区" },
  { id: "kanda", name: "神田", lineName: "JR山手線・京浜東北線・中央線", ward: "千代田区" },

  { id: "ochanomizu", name: "御茶ノ水", lineName: "JR中央線・中央・総武線", ward: "千代田区" },
  { id: "suidobashi", name: "水道橋", lineName: "JR中央・総武線", ward: "千代田区" },
  { id: "iidabashi", name: "飯田橋", lineName: "JR中央・総武線", ward: "千代田区" },
  { id: "ichigaya", name: "市ケ谷", lineName: "JR中央・総武線", ward: "千代田区" },
  { id: "yotsuya", name: "四ツ谷", lineName: "JR中央線・中央・総武線", ward: "新宿区" },
  { id: "shinanomachi", name: "信濃町", lineName: "JR中央・総武線", ward: "新宿区" },
  { id: "sendagaya", name: "千駄ケ谷", lineName: "JR中央・総武線", ward: "渋谷区" },
  { id: "okubo", name: "大久保", lineName: "JR中央・総武線", ward: "新宿区" },
  { id: "higashi-nakano", name: "東中野", lineName: "JR中央・総武線", ward: "中野区" },
  { id: "nakano", name: "中野", lineName: "JR中央線・中央・総武線", ward: "中野区" },
  { id: "koenji", name: "高円寺", lineName: "JR中央線・中央・総武線", ward: "杉並区" },
  { id: "asagaya", name: "阿佐ケ谷", lineName: "JR中央線・中央・総武線", ward: "杉並区" },
  { id: "ogikubo", name: "荻窪", lineName: "JR中央線・中央・総武線", ward: "杉並区" },
  { id: "nishi-ogikubo", name: "西荻窪", lineName: "JR中央線・中央・総武線", ward: "杉並区" },

  { id: "asakusabashi", name: "浅草橋", lineName: "JR中央・総武線", ward: "台東区" },
  { id: "ryogoku", name: "両国", lineName: "JR中央・総武線", ward: "墨田区" },
  { id: "kinshicho", name: "錦糸町", lineName: "JR中央・総武線・総武快速線", ward: "墨田区" },
  { id: "kameido", name: "亀戸", lineName: "JR中央・総武線", ward: "江東区" },
  { id: "hirai", name: "平井", lineName: "JR中央・総武線", ward: "江戸川区" },
  { id: "shin-koiwa", name: "新小岩", lineName: "JR中央・総武線・総武快速線", ward: "葛飾区" },
  { id: "koiwa", name: "小岩", lineName: "JR中央・総武線", ward: "江戸川区" },
  { id: "shin-nihombashi", name: "新日本橋", lineName: "JR総武快速線", ward: "中央区" },
  { id: "bakurocho", name: "馬喰町", lineName: "JR総武快速線", ward: "中央区" },

  { id: "kaminakazato", name: "上中里", lineName: "JR京浜東北線", ward: "北区" },
  { id: "oji", name: "王子", lineName: "JR京浜東北線", ward: "北区" },
  { id: "higashi-jujo", name: "東十条", lineName: "JR京浜東北線", ward: "北区" },
  { id: "akabane", name: "赤羽", lineName: "JR京浜東北線・埼京線・宇都宮線ほか", ward: "北区" },

  { id: "itabashi", name: "板橋", lineName: "JR埼京線", ward: "板橋区" },
  { id: "jujo", name: "十条", lineName: "JR埼京線", ward: "北区" },
  { id: "kita-akabane", name: "北赤羽", lineName: "JR埼京線", ward: "北区" },
  { id: "ukima-funado", name: "浮間舟渡", lineName: "JR埼京線", ward: "北区" },

  { id: "oku", name: "尾久", lineName: "JR宇都宮線・高崎線", ward: "北区" },

  { id: "mikawashima", name: "三河島", lineName: "JR常磐線", ward: "荒川区" },
  { id: "minami-senju", name: "南千住", lineName: "JR常磐線", ward: "荒川区" },
  { id: "kita-senju", name: "北千住", lineName: "JR常磐線", ward: "足立区" },
  { id: "ayase", name: "綾瀬", lineName: "JR常磐線各駅停車", ward: "足立区" },
  { id: "kameari", name: "亀有", lineName: "JR常磐線各駅停車", ward: "葛飾区" },
  { id: "kanamachi", name: "金町", lineName: "JR常磐線各駅停車", ward: "葛飾区" },

  { id: "hatchobori", name: "八丁堀", lineName: "JR京葉線", ward: "中央区" },
  { id: "etchujima", name: "越中島", lineName: "JR京葉線", ward: "江東区" },
  { id: "shiomi", name: "潮見", lineName: "JR京葉線", ward: "江東区" },
  { id: "shin-kiba", name: "新木場", lineName: "JR京葉線", ward: "江東区" },
  { id: "kasai-rinkai-koen", name: "葛西臨海公園", lineName: "JR京葉線", ward: "江戸川区" },

  { id: "nishi-oi", name: "西大井", lineName: "JR横須賀線・湘南新宿ライン", ward: "品川区" },
];

function createInitialStations(): Station[] {
  return MASTER_STATIONS.map((station) => ({
    ...station,
    visited: false,
    memo: "",
  }));
}

function mergeSavedStations(savedStations: Station[]): Station[] {
  return MASTER_STATIONS.map((masterStation) => {
    const savedStation = savedStations.find(
      (station) =>
        station.id === masterStation.id || station.name === masterStation.name
    );

    return {
      ...masterStation,
      visited: savedStation?.visited ?? false,
      visitedAt: savedStation?.visitedAt,
      memo: savedStation?.memo ?? "",
    };
  });
}

function App() {
  const [stations, setStations] = useState<Station[]>(createInitialStations);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<"all" | "visited" | "unvisited">("all");
  const [screen, setScreen] = useState<"menu" | "register" | "history">("menu");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setStations(createInitialStations());
      return;
    }

    try {
      const parsedStations = JSON.parse(saved) as Station[];
      setStations(mergeSavedStations(parsedStations));
    } catch {
      setStations(createInitialStations());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stations));
  }, [stations]);

  const visitedCount = stations.filter((station) => station.visited).length;

  const completionRate = useMemo(() => {
    if (stations.length === 0) return 0;
    return Math.round((visitedCount / stations.length) * 100);
  }, [stations.length, visitedCount]);

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const keyword = searchText.trim().toLowerCase();

      const matchesKeyword =
        keyword.length === 0 ||
        station.name.toLowerCase().includes(keyword) ||
        station.lineName.toLowerCase().includes(keyword) ||
        station.ward.toLowerCase().includes(keyword);

      const matchesFilter =
        filter === "all" ||
        (filter === "visited" && station.visited) ||
        (filter === "unvisited" && !station.visited);

      return matchesKeyword && matchesFilter;
    });
  }, [stations, searchText, filter]);

  const historyStations = useMemo(() => {
    return stations
      .filter((station) => station.visited)
      .sort((a, b) => {
        const dateA = a.visitedAt ?? "";
        const dateB = b.visitedAt ?? "";
        return dateB.localeCompare(dateA);
      });
  }, [stations]);

  const toggleVisited = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);

    setStations((current) =>
      current.map((station) =>
        station.id === id
          ? {
              ...station,
              visited: !station.visited,
              visitedAt: station.visited ? undefined : today,
            }
          : station
      )
    );
  };

  const updateMemo = (id: string, memo: string) => {
    setStations((current) =>
      current.map((station) =>
        station.id === id ? { ...station, memo } : station
      )
    );
  };

  const resetAll = () => {
    const ok = window.confirm("訪問済み・メモをすべてリセットしますか？");
    if (!ok) return;

    setStations(createInitialStations());
  };

  if (screen === "menu") {
    return (
      <main className="app notebook-page history-page">
        <div className="home-background" />

        <div className="home-overlay">
          <div className="home-title-area">
            <p className="home-subtitle">Tokyo 23 Wards JR Stamp Rally</p>
            <h1>香織の駅巡り</h1>
          </div>

          <div className="home-menu-buttons">
            <button
              className="floating-menu-button"
              onClick={() => setScreen("register")}
            >
              駅の登録
            </button>

            <button
              className="floating-menu-button"
              onClick={() => setScreen("history")}
            >
              訪問履歴
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (screen === "history") {
    return (
<main className="app notebook-page register-page">
        <button className="back-button" onClick={() => setScreen("menu")}>
          ← トップに戻る
        </button>

        <header className="header">
          <div>
            <p className="eyebrow">Visit History</p>
            <h1>訪問履歴</h1>
            <p className="description">
              訪問済みにした駅を、新しい順に表示しています。
            </p>
          </div>
        </header>

        <section className="station-list">
          <div className="station-list-header">
            <h2>過去の訪問履歴</h2>
            <p className="history-count">{historyStations.length}駅</p>
          </div>

          {historyStations.length === 0 ? (
            <p className="empty">まだ訪問済みの駅がありません。</p>
          ) : (
            historyStations.map((station) => (
<article
  key={station.id}
  className={`station-card ticket-card ${station.visited ? "visited-card" : ""}`}
>
                <div className="station-main">
                  <div>
                    <h3>✅ {station.name}駅</h3>
                    <p>{station.lineName}</p>
                    <p>{station.ward}</p>
                    {station.visitedAt && (
                      <p className="visited-date">訪問日: {station.visitedAt}</p>
                    )}
                  </div>

                  <button
                    className="secondary-button"
                    onClick={() => toggleVisited(station.id)}
                  >
                    未訪問に戻す
                  </button>
                </div>

                {station.memo ? (
                  <p className="history-memo">{station.memo}</p>
                ) : (
                  <p className="empty">メモなし</p>
                )}
              </article>
            ))
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <button className="back-button" onClick={() => setScreen("menu")}>
        ← トップに戻る
      </button>

      <header className="header">
        <div>
          <p className="eyebrow">Station Register</p>
          <h1>駅の登録</h1>
          <p className="description">
            東京23区内のJR駅から選んで、訪問済みとして記録できます。
          </p>
        </div>
      </header>

      <section className="summary">
        <div className="summary-card">
          <span>対象駅数</span>
          <strong>{stations.length}</strong>
        </div>
        <div className="summary-card">
          <span>訪問済み</span>
          <strong>{visitedCount}</strong>
        </div>
        <div className="summary-card">
          <span>達成率</span>
          <strong>{completionRate}%</strong>
        </div>
      </section>

      <section className="form-card">
        <h2>駅を探す</h2>

        <div className="form">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="駅名・路線名・区で検索 例: 山手線 / 北区 / 東京"
          />

          <button onClick={() => setFilter("all")}>すべて</button>
          <button onClick={() => setFilter("unvisited")}>未訪問</button>
          <button onClick={() => setFilter("visited")}>訪問済み</button>
        </div>
      </section>

      <section className="station-list">
        <div className="station-list-header">
          <h2>駅一覧</h2>
          <button className="delete-button" onClick={resetAll}>
            全リセット
          </button>
        </div>

        <p className="empty">
          表示中: {filteredStations.length}駅 / 全{stations.length}駅
        </p>

        {filteredStations.map((station) => (
<article
  key={station.id}
  className={`station-card ticket-card ${station.visited ? "visited-card" : ""}`}
>
            <div className="station-main">
              <div>
                <h3>
                  <span>{station.visited ? "✅" : "⬜"}</span>
                  {station.name}駅
                </h3>
                <p>{station.lineName}</p>
                <p>{station.ward}</p>
                {station.visitedAt && (
                  <p className="visited-date">訪問日: {station.visitedAt}</p>
                )}
              </div>

              <button
                className={station.visited ? "secondary-button" : ""}
                onClick={() => toggleVisited(station.id)}
              >
                {station.visited ? "未訪問に戻す" : "訪問済みにする"}
              </button>
            </div>

            <textarea
              value={station.memo || ""}
              onChange={(event) => updateMemo(station.id, event.target.value)}
              placeholder="メモを書く"
            />
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;