# ProductScene - 电商产品场景图生成器 MVP 开发计划

> AI产品工厂 第3个产品 | 面向普通用户（非开发者）| 2026-08-27 立项

## 一、产品定位

**一句话**：上传白底产品图，AI一键生成多场景营销图。

**目标用户**：Etsy/Shopify/亚马逊小卖家、社交媒体电商博主
**核心痛点**：专业产品摄影$150-500/次太贵，不会PS，但好图直接影响转化率
**价值主张**：$19/月 vs $500/次摄影，AI生成场景图降低34%摄影成本、提升12%转化率

## 二、技术架构

```
用户浏览器 → Next.js (Vercel) → API Route
                                    ├── 背景移除 (Fal.ai)
                                    ├── 场景生成 (Fal.ai Flux)
                                    └── 支付认证 (Paddle + HMAC API Key)
```

**技术栈**：
- 前端：Next.js 16 + Tailwind CSS 4 + TypeScript
- AI：Fal.ai（背景移除 + Flux image-to-image）
- 支付：Paddle（复用DocForge的Paddle账号基础设施）
- 认证：HMAC API Key（复用OG Image API的零数据库方案）
- 部署：GitHub API推代码 → Vercel自动部署

## 三、MVP功能范围

### 核心功能（必须有）
1. 落地页（Hero + 功能 + 定价 + FAQ）
2. 产品图上传（拖拽，JPG/PNG，≤10MB）
3. AI场景生成（产品主体保真，核心卖点）
4. 20个场景模板（白底/生活/质感/节日）
5. 一次批量生成4张变体
6. 平台预设导出（Amazon/Etsy/Instagram/Shopify/TikTok）
7. 轻量图片精修
8. Credits计费 + Paddle支付

### V2不做
- 用户注册系统、历史记录、AI模特试衣、风格复刻、详情页生成、图片翻译、视频生成、团队协作

## 四、定价

| 套餐 | 价格 | Credits |
|------|------|---------|
| Free | $0 | 3次（带水印） |
| Starter | $9/月 | 50张 |
| Pro | $19/月 | 200张 + 高清 |
| Business | $49/月 | 600张 + 批量 |

## 五、国内竞品参考
- 美图设计室：AI商品图+模特试衣+批量抠图，日均50万张
- Shopix AI：多平台主图+详情页+精修+视频
- 创客贴：100万+模板+AI agent
- Flyelep AI：主体一致性+12种语言
- Picset AI：风格复刻+智能排版
- Flux Art：多模型聚合+4K+局部修改

## 六、成功指标
- 2周：10+付费用户
- 1个月：$500+ MRR
- 3个月：$2K-5K MRR
- 止损：3个月<$100/月则调整
