%
% 卒研発表要旨用クラスファイル
% cis-resume.cls
%
\ProvidesClass{cis-resume}[2016/11/24 島根大学総合理工学部 数理・情報システム学科 情報系 卒業研究要旨]

%
% jsarticleの読み込み
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{jsarticle}}
\ProcessOptions\relax
\LoadClass{jsarticle}

%
% Load packages
\RequirePackage[top=10truemm,bottom=10truemm,left=20truemm,right=20truemm]{geometry}
\RequirePackage{graphicx}

% ページスタイル
\pagestyle{empty}

% 行間の設定
\def\baselinestretch{0.85}

% タイトル部の設定
\def\course#1{\gdef\@course{#1}}
\def\stunum#1{\gdef\@stunum{#1}}
\def\supervisor#1{\gdef\@supervisor{#1}}
\def\maketitle{
\twocolumn
[
\centering
{\Large \textbf{\@title}}
\flushright \baselineskip 4.5mm
\@course~~~\@author (\@stunum) \\
指導教員：\@supervisor
\bigskip
]
}

% Sectionの設定
\def\section{\@startsection{section}{2}{\z@}
{.4ex plus .8ex minus .2ex}{.03ex plus .07ex}{\bf}}

% SubSectionの設定
\def\subsection{\@startsection{subsection}{2}{\z@}
{.8ex plus .8ex minus .2ex}{.05ex plus .07ex}{\bf}}

% 図中のキャプションの設定
 \long\def\@caption#1[#2]#3{\par\addcontentsline{\csname
   ext@#1\endcsname}{#1}{\protect\numberline{\csname
   the#1\endcsname}{\ignorespaces #2}}\begingroup
     \@parboxrestore
     \small
     \@makecaption{\csname fnum@#1\endcsname}{\ignorespaces #3}\par
   \endgroup}

