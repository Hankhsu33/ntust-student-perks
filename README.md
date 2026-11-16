# NTUST Student Perks

臺科學生的優惠店家清單與互動地圖。

Designed and developed by HSU HAN SHENG.
Copyright © 2026 HSU HAN SHENG. All rights reserved.
商標及第三方素材權利歸原權利人所有。

## 開發

需要 Node.js 22 以上，不需安裝外部套件。

```sh
npm run check
npm run build
npm start
```

開啟 http://127.0.0.1:8765。

## 發布

推送 main 後，GitHub Actions 建置 dist 並發布 GitHub Pages。
公開網址：https://hankhsu33.github.io/ntust-student-perks/
GitHub Variables 的 SITE_URL 設為以上網址（不含最後斜線）。

目前採用本地公開 JSON 快照。店家合作期限、適用資格、圖片及部分地址仍待確認，詳情依頁面說明。
未設定 Google Sheets Secrets，不會執行外部資料同步。正式接入前需先完成欄位映射和資料審核。
GA4_ID 為選填，目前未啟用分析。

## 素材來源

地圖使用 Leaflet 1.9.4、CARTO 與 OpenStreetMap，頁面保留其署名。底圖服務依各提供者政策使用。
學生會徽章取自 https://ntustsa.oen.tw/ 使用的原圖，未修改顏色或比例。
學生證為虛構示意圖片，不含真實學生個資，非有效證件。
原始學生證照片、內部簽約草稿與工作檔不在此儲存庫。

## 2026-11-16 店家清單更新
僅收錄「第20屆特約商店」OO 分頁中「優惠內容」非空白的 14 家店家。店名、地址、電話、優惠與簽約狀況皆依該列資料。工作表1為學生期望的優惠，不作為上架來源。資料仍為快照，非即時同步。

## Google Maps 商家資料
2026-11-16 已逐家核對 14 筆商家，採用 Google Maps 商家座標與 Place ID，導航連結指定分店。可取得的 12 筆電話與 12 筆每週營業時間已更新；未提供欄位保留待確認。Tower Lucky 查得永和總店，優惠適用分店仍須學生會確認。優惠與規則保持 OO 分頁原文。

