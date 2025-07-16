"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Github, Mail, ExternalLink, Code, Database, Smartphone, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/theme-toggle";
import CursorTracking from "@/components/cursor-tracking";
import OtherCursors from "@/components/other-cursors";
import { useUserId } from "@/hooks/use-user-id";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'copy';
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const userId = useUserId();

  const EMAIL_ADDRESS = "Tisk.address@gmail.com";
  const SUBJECT = "ポートフォリオサイトからのお問い合わせ";
  const BODY = `こんにちは！

ポートフォリオサイトを拝見させていただきました。

【お問い合わせ内容】
（こちらにご用件をお書きください）

【お名前】
（お名前をお書きください）

【会社名・組織名】
（該当する場合はお書きください）

よろしくお願いいたします。`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // フィードバックメッセージを表示する関数
  const showFeedback = (message: string, type: 'success' | 'error' | 'copy') => {
    setEmailFeedback({ show: true, message, type });
    setTimeout(() => {
      setEmailFeedback({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // メールアドレスをクリップボードにコピーする関数
  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopiedEmail(true);
      showFeedback("📧 メールアドレスをコピーしました！", 'copy');
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('クリップボードへのコピーに失敗:', err);
      showFeedback("❌ コピーに失敗しました。手動でコピーしてください。", 'error');
    }
  };

  // メールクライアントを開く関数（完璧版）
  const openEmailClient = () => {
    try {
      // URLエンコードされたメールリンクを作成
      const encodedSubject = encodeURIComponent(SUBJECT);
      const encodedBody = encodeURIComponent(BODY);
      const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${encodedSubject}&body=${encodedBody}`;
      
      // ユーザーエージェントを検出
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isIOS = /iphone|ipad|ipod/i.test(userAgent);
      const isAndroid = /android/i.test(userAgent);
      
      // デバイス固有の処理
      if (isMobile) {
        if (isIOS) {
          // iOSの場合、新しいウィンドウで開く
          window.open(mailtoUrl, '_blank');
        } else if (isAndroid) {
          // Androidの場合、直接開く
          window.location.href = mailtoUrl;
        } else {
          // その他のモバイルデバイス
          window.open(mailtoUrl, '_blank');
        }
      } else {
        // デスクトップの場合
        window.location.href = mailtoUrl;
      }
      
      showFeedback("📧 メールクライアントを開いています...", 'success');
      
      // フォールバック: 3秒後にメールが開かない場合の処理
      setTimeout(() => {
        if (confirm('メールクライアントが開かない場合は、手動でコピーしますか？')) {
          copyEmailToClipboard();
        }
      }, 3000);
      
    } catch (error) {
      console.error('メールクライアントの起動に失敗:', error);
      showFeedback("❌ メールクライアントの起動に失敗しました", 'error');
      
      // エラー時のフォールバック
      if (confirm('メールクライアントが開けませんでした。メールアドレスをコピーしますか？')) {
        copyEmailToClipboard();
      }
    }
  };

  if (!mounted) {
    return null;
  }

  const projects = [
    {
      title: "🌍 例のヤツ｜ブログ",
      description: "あなたの思いや知識を共有し、世界とつながるブログプラットフォーム。Markdown対応で美しく読みやすい記事を手軽に作成でき、技術・趣味・生活など自由なトピックで発信可能。",
      tech: ["Next.js", "React", "Markdown", "Vercel", "TypeScript"],
      icon: <Code className="h-6 w-6" />,
      url: "https://reinoyatu-blog.vercel.app/"
    },
    {
      title: "💬 フリーテキスト通話",
      description: "ユーザー名だけで参加可能！匿名・登録不要でリアルタイムのテキスト通話を楽しめるプラットフォーム。既存ルームへの参加や新しいルーム作成も自由自在。",
      tech: ["Next.js", "Firebase Realtime DB", "TypeScript", "Vercel"],
      icon: <Smartphone className="h-6 w-6" />,
      url: "https://text-calling.vercel.app/"
    },
    {
      title: "🛡️ 求人安全性分析ツール",
      description: "闇バイトのリスクをAIが検出！求人のテキストや画像を入力するだけで安全性を自動チェック。分析履歴・統計情報・ダークモード対応で使いやすさも抜群。",
      tech: ["Next.js", "Gemini API", "Image Analysis", "Netlify"],
      icon: <Database className="h-6 w-6" />,
      url: "https://safejob.netlify.app/"
    },
    {
      title: "🎯 リアルタイムマウス共有システム",
      description: "Firebase Realtime Databaseを使用して、複数ユーザーのマウス位置をリアルタイムで共有する革新的なポートフォリオサイト。このサイト自体がデモンストレーション！",
      tech: ["Next.js", "Firebase", "TypeScript", "Tailwind CSS"],
      icon: <Code className="h-6 w-6" />,
      url: "https://github.com/systemcmd0122/My-Portfolio"
    },
  ];

  const skillCategories = [
    {
      category: "フロントエンド",
      skills: ["JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "HTML5", "CSS3", "Sass/SCSS", "Tailwind CSS", "Bootstrap", "Material-UI", "Chakra UI", "Styled Components"]
    },
    {
      category: "バックエンド",
      skills: ["Node.js", "Express.js", "Nest.js", "Python", "Django", "FastAPI", "Flask", "PHP", "Laravel", "Ruby", "Ruby on Rails", "Java", "Spring Boot", "C#", ".NET", "Go", "Rust"]
    },
    {
      category: "データベース",
      skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Supabase", "SQLite", "DynamoDB", "Elasticsearch", "Neo4j", "Cassandra"]
    },
    {
      category: "クラウド・インフラ",
      skills: ["AWS", "Google Cloud", "Azure", "Vercel", "Netlify", "Heroku", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "CircleCI"]
    },
    {
      category: "モバイル開発",
      skills: ["React Native", "Flutter", "Swift", "Kotlin", "Ionic", "Xamarin", "Cordova"]
    },
    {
      category: "AI・機械学習",
      skills: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenAI API", "Hugging Face", "Pandas", "NumPy", "Jupyter", "OpenCV"]
    },
    {
      category: "ツール・その他",
      skills: ["Git", "GitHub", "GitLab", "Figma", "Adobe XD", "Photoshop", "Webpack", "Vite", "ESLint", "Prettier", "Jest", "Cypress", "Storybook"]
    },
    {
      category: "遊び・趣味系",
      skills: ["ゲーム開発", "Unity", "Unreal Engine", "Blender", "Three.js", "WebGL", "Canvas API", "Web Audio API", "WebRTC", "Socket.io", "Discord Bot", "LINE Bot", "Slack Bot", "Chrome拡張", "Electron"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <CursorTracking />
      <OtherCursors />
      
      {/* フィードバック通知 */}
      {emailFeedback.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          emailFeedback.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700' 
            : emailFeedback.type === 'copy'
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700'
            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
        }`}>
          <div className="flex items-center gap-2">
            {emailFeedback.type === 'copy' && <Check className="h-4 w-4" />}
            {emailFeedback.message}
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image 
                src="/icon.jpg" 
                alt="ポートフォリオアイコン" 
                width={32} 
                height={32} 
                className="rounded-full"
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tisk's Portfolio
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                {userId && `ID: ${userId.substring(0, 8)}`}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <section className="text-center py-12 sm:py-20">
          <div className="relative">
            <div className="flex justify-center mb-8">
              <Image 
                src="/icon.jpg" 
                alt="メインアイコン" 
                width={120} 
                height={120} 
                className="rounded-full shadow-2xl border-4 border-white dark:border-gray-800"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative">
              <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                リアルタイム
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  マウス共有
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Firebase Realtime Databaseを使用して、複数ユーザーのマウス位置をリアルタイムで共有する革新的なポートフォリオサイト
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => window.open('https://github.com/systemcmd0122/My-Portfolio', '_blank')}
                >
                  <Github className="mr-2 h-5 w-5" />
                  GitHubで見る
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={openEmailClient}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  お問い合わせ
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              このサイトの特徴
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              他のユーザーのマウス位置がリアルタイムで表示されます。複数のタブで開いて試してみてください！
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>リアルタイム同期</CardTitle>
                <CardDescription>Firebase Realtime Databaseによる即座のデータ同期</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>マルチデバイス対応</CardTitle>
                <CardDescription>PC・タブレット・スマートフォンすべてに対応</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>モダンな技術</CardTitle>
                <CardDescription>Next.js、TypeScript、Tailwind CSSの最新技術</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              プロジェクト
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              最新の技術を使用して開発したプロジェクトの一覧です
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:scale-110 transition-transform">
                      {project.icon}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(project.url, '_blank')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => window.open(project.url, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    プロジェクトを見る
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              技術スキル
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              フロントエンドからバックエンド、AI・機械学習、遊び系まで幅広い技術に対応
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto space-y-8">
            {skillCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mr-3"></span>
                  {category.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex} 
                      variant="outline" 
                      className={`py-1 px-3 transition-all duration-300 hover:scale-105 ${
                        category.category === "遊び・趣味系" 
                          ? "bg-gradient-to-r from-pink-100 to-yellow-100 dark:from-pink-900 dark:to-yellow-900 hover:from-pink-200 hover:to-yellow-200 dark:hover:from-pink-800 dark:hover:to-yellow-800 border-pink-300 dark:border-pink-700" 
                          : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white"
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              お問い合わせ
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              プロジェクトについてのご相談やお問い合わせはお気軽にどうぞ
            </p>
            
            {/* メールアドレス表示 */}
            <div className="mb-6 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-lg font-mono text-gray-900 dark:text-white">
                  {EMAIL_ADDRESS}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyEmailToClipboard}
                  className="ml-2 hover:bg-blue-100 dark:hover:bg-blue-900"
                >
                  {copiedEmail ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                クリックでコピー、またはメールクライアントで開く
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={openEmailClient}
              >
                <Mail className="mr-2 h-5 w-5" />
                メールで連絡
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={copyEmailToClipboard}
              >
                <Copy className="mr-2 h-5 w-5" />
                メールアドレスをコピー
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open('https://github.com/systemcmd0122', '_blank')}
              >
                <Github className="mr-2 h-5 w-5" />
                GitHubを見る
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400 space-y-4">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://reinoyatu-blog.vercel.app/', '_blank')}
              >
                🌍 ブログ
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://text-calling.vercel.app/', '_blank')}
              >
                💬 テキスト通話
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://safejob.netlify.app/', '_blank')}
              >
                🛡️ 求人分析
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://github.com/systemcmd0122/My-Portfolio', '_blank')}
              >
                <Github className="mr-1 h-3 w-3" />
                このサイトのコード
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <button 
                  onClick={copyEmailToClipboard}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline"
                >
                  {EMAIL_ADDRESS}
                </button>
              </div>
              <a 
                href="https://github.com/systemcmd0122" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                systemcmd0122
              </a>
            </div>
            <p>© 2025 リアルタイムマウス共有ポートフォリオ. All rights reserved.</p>
            <p className="mt-2 text-sm">
              現在のアクティブユーザー: {userId ? `あなた (${userId.substring(0, 8)}) 🎯` : "読み込み中..."}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              他のユーザーのマウスカーソルには可愛い絵文字が付いています 🐱✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}