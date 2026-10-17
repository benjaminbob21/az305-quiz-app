# AZ-305 Exam Simulator & Interactive Practice Question Bank

Interactive exam preparation application for the **Microsoft Certified: Azure Solutions Architect Expert (AZ-305)** certification exam.

Powered by **Next.js 16**, **React 19**, **Tailwind CSS**, and **Turbopack**.

---

## 🚀 Features

- **163 Comprehensive MeasureUp-Aligned Master Questions**:
  - Multiple Choice
  - Multiple Select / Multiple Choice (Select Two)
  - Yes/No Statements & Statement Evaluation Tables
  - Dropdown / Matching & Dropdown Hotspot
  - Drag and Drop / Matching & Ordering
  - Case Studies & Multi-Part Solution Evaluation Series
- **Full Domain Coverage**:
  - **Domain 1**: Design Business Continuity Solutions (25 questions)
  - **Domain 2**: Design Infrastructure Solutions (54 questions)
  - **Domain 3**: Design Data Storage Solutions (40 questions)
  - **Domain 4**: Design Identity, Governance, and Monitoring Solutions (44 questions)
- **Practice & Study Mode**:
  - Instant answer validation with color-coded feedback (emerald/rose).
  - In-depth architectural rationales and distractor analyses for every option.
  - Direct links to official Microsoft Learn architecture documentation.
- **Interactive Question Navigator**:
  - Slide-in palette with direct jump to any of the 163 questions.
  - Question flagging/bookmarking (`★`) for targeted review.
  - Real-time progress and completion counter.
- **Search & Filtering**:
  - Filter by Azure certification domain.
  - Instant text search across questions, topics, subdomains, and question numbers.

---

## 🛠️ Getting Started Locally

```bash
# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

### Option 1: Deploy via GitHub (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/<your-username>/az305-quiz-app.git
   git branch -M main
   git push -u origin main
   ```
2. Navigate to [Vercel](https://vercel.com/new).
3. Select **Import Git Repository** and choose `az305-quiz-app`.
4. Keep standard Next.js default build settings (`next build`) and click **Deploy**.

### Option 2: Deploy directly with Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 📚 Repository Structure

- `src/app/page.tsx` - Interactive quiz interface and state management.
- `src/app/layout.tsx` - Root layout and metadata configuration.
- `src/data/questions.json` - Complete synchronized JSON database of 163 questions.
- `docs/az305_quiz_bank.md` - Formatted Markdown Question Bank with explanations.
- `docs/az305_quiz_bank.json` - Standalone JSON dump of the full question set.
