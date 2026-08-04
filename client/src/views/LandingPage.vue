<template>
  <Toast position="top-center" />
  <div
    class="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-800 dark:text-gray-100 overflow-x-hidden font-sans selection:bg-green-500/30"
  >
    <!--suppress CssUnknownTarget -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05] dark:invert"
      style="
        background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);
      "
    ></div>

    <nav
      class="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all"
    >
      <div class="container mx-auto px-6 h-20 flex justify-between items-center">
        <div class="flex items-center gap-4 cursor-default group select-none">
          <!-- 横向 Logo -->
          <img
            :src="themeStore.isDark ? logoWhite : logoDark"
            alt="logo"
            class="h-10 md:h-11 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />

          <!-- 原有文字 -->
          <div class="flex flex-col">
            <span
              class="text-xl font-bold tracking-wide leading-none text-gray-800 dark:text-white"
            >
              田间助手
            </span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button
            class="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors mr-2"
            @click="themeStore.toggleDark($event)"
          >
            <i
              :class="themeStore.isDark ? 'pi pi-moon' : 'pi pi-sun text-yellow-500'"
              class="transition-transform duration-500 rotate-0 dark:rotate-360"
            ></i>
          </button>

          <button
            class="hidden md:block text-gray-500 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-bold text-sm px-4 py-2 transition-colors"
            @click="$router.push('/auth')"
          >
            登录
          </button>
          <button
            class="bg-gray-900 dark:bg-green-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 dark:hover:bg-green-700 hover:shadow-lg transition-all active:scale-95"
            @click="$router.push('/auth')"
          >
            免费注册
          </button>
        </div>
      </div>
    </nav>

    <header
      class="relative pt-36 pb-20 md:pt-52 md:pb-32 px-4 overflow-hidden flex flex-col items-center text-center"
    >
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-green-50/80 dark:bg-green-900/20 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-normal pointer-events-none"
      ></div>

      <div class="container mx-auto max-w-5xl z-10">
        <div
          v-observe
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-green-100 dark:border-gray-700 text-green-700 dark:text-green-400 text-xs font-bold mb-8 shadow-sm"
        >
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          智慧农业数字孪生平台
        </div>

        <h1
          v-observe
          class="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.1] text-gray-900 dark:text-white"
        >
          让每一寸土地 <br class="md:hidden" />
          <span class="text-green-600 dark:text-green-500 relative inline-block">
            都会思考
            <svg
              class="absolute -bottom-2 left-0 w-full h-3 text-yellow-300 dark:text-yellow-600/50 opacity-60"
              preserveAspectRatio="none"
              viewBox="0 0 100 10"
            >
              <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" stroke-width="8" />
            </svg>
          </span>
        </h1>

        <p
          v-observe
          class="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto"
        >
          连接
          <span class="font-bold text-gray-800 dark:text-gray-200">农户、土地、市场</span>
          的超级大脑。<br class="hidden md:block" />
          从一颗种子的发芽，到市场价格的最高点，我们全程守护。
        </p>

        <div v-observe class="flex justify-center">
          <button
            class="px-10 py-4 bg-green-600 text-white font-bold rounded-full text-lg hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
            @click="$router.push('/auth')"
          >
            开启智慧农场 <i class="pi pi-arrow-right text-sm"></i>
          </button>
        </div>
      </div>
    </header>

    <section class="py-20 md:py-32 px-4 relative">
      <div class="container mx-auto max-w-6xl">
        <div class="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div v-observe class="w-full md:w-1/2">
            <div
              class="inline-block px-3 py-1 mb-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold tracking-wider uppercase"
            >
              Market Intelligence
            </div>

            <h2
              class="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900 dark:text-white"
            >
              种得好，<br />更要<span class="text-green-600 dark:text-green-500">卖得巧</span>
            </h2>

            <p class="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              聚焦粮食流通信息整合，缓解“信息差”问题。系统基于
              <span class="font-bold text-gray-800 dark:text-gray-200">国家粮食和物资储备局</span>
              等权威渠道数据，持续汇总全国玉米收购价动态，通过数据整理与趋势呈现，为您的出售时机提供
              <span class="font-bold text-gray-800 dark:text-gray-200">理性参考与辅助判断</span>。
            </p>

            <div class="flex gap-8 border-t border-gray-200 dark:border-gray-800 pt-8">
              <div>
                <div class="text-3xl font-black text-green-600 dark:text-green-500">权威数据</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 font-bold mt-1">
                  来源可靠可追溯
                </div>
              </div>

              <div class="w-px bg-gray-200 dark:bg-gray-800"></div>

              <div>
                <div class="text-3xl font-black text-green-600 dark:text-green-500">持续更新</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 font-bold mt-1">
                  覆盖多地区行情
                </div>
              </div>
            </div>
          </div>

          <div v-observe class="w-full md:w-1/2 relative group">
            <div
              class="relative z-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-green-900/5 dark:shadow-none transform rotate-1 group-hover:rotate-0 transition-transform duration-500"
            >
              <div class="flex justify-between items-center mb-8">
                <div>
                  <div class="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    玉米收购价参考指数
                  </div>
                  <div class="text-2xl font-black text-gray-800 dark:text-white">
                    ¥ 1.34 <span class="text-sm font-normal text-gray-400">/斤</span>
                  </div>
                </div>

                <div
                  class="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold"
                >
                  <i class="pi pi-chart-line"></i> 建议关注出售信号
                </div>
              </div>

              <div
                class="w-full aspect-2/1 relative border-b border-l border-gray-100 dark:border-gray-700"
              >
                <svg
                  class="absolute inset-0 w-full h-full"
                  overflow="visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 500 200"
                >
                  <defs>
                    <linearGradient id="chartFill" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" style="stop-color: #22c55e; stop-opacity: 0.2" />
                      <stop offset="100%" style="stop-color: #22c55e; stop-opacity: 0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0,160 Q150,160 200,100 T320,30 T500,120 V200 H0 Z"
                    fill="url(#chartFill)"
                  />
                  <path
                    d="M0,160 Q150,160 200,100 T320,30 T500,120"
                    fill="none"
                    stroke="#22c55e"
                    stroke-linecap="round"
                    stroke-width="4"
                  />
                </svg>

                <div
                  class="absolute w-5 h-5 bg-yellow-400 rounded-full shadow-[0_0_0_4px_rgba(250,204,21,0.3)] animate-pulse z-20"
                  style="top: 15%; left: 64%; transform: translate(-50%, -50%)"
                ></div>

                <div
                  class="absolute bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl whitespace-nowrap z-20"
                  style="top: 0; left: 64%; transform: translateX(-50%)"
                >
                  阶段性高位区间
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-700"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="py-20 md:py-32 px-4 relative bg-white dark:bg-gray-900/50 border-y border-gray-50 dark:border-gray-800/50 transition-colors"
    >
      <div class="container mx-auto max-w-6xl">
        <div class="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
          <div v-observe class="w-full md:w-1/2">
            <div
              class="inline-block px-3 py-1 mb-6 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold tracking-wider uppercase"
            >
              Smart Weather
            </div>
            <h2
              class="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900 dark:text-white"
            >
              看天吃饭，<br />也能<span class="text-blue-500">胜天半子</span>
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              接入
              <span class="font-bold text-gray-800 dark:text-gray-200">和风天气 (QWeather)</span>
              商业级数据。 <br />基于未来 15 天气象数据，遭遇<span
              class="text-blue-600 dark:text-blue-400 font-bold"
            >暴雨、霜冻</span
            >前，系统自动生成排涝或保温建议。
            </p>
            <ul class="space-y-4 text-gray-700 dark:text-gray-300">
              <li class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400"
                >
                  <i class="pi pi-shield"></i>
                </div>
                <span class="font-bold">气象灾害提前 48h 预警</span>
              </li>
            </ul>
          </div>
          <div v-observe class="w-full md:w-1/2 relative group">
            <div
              class="relative z-10 bg-linear-to-br from-blue-500 to-cyan-400 dark:from-blue-600 dark:to-cyan-600 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-900/20 dark:shadow-none text-white overflow-hidden transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"
            >
              <i
                class="pi pi-cloud absolute -right-10 -top-10 text-[200px] text-white opacity-10"
              ></i>
              <div class="relative z-10">
                <div class="text-sm font-bold opacity-80 mb-2">我的地块 - 南洼地</div>
                <div class="text-6xl font-black mb-4">24°C</div>
                <div class="flex items-center gap-2 mb-8 text-lg font-bold">
                  <i class="pi pi-sun text-yellow-300 animate-spin-slow"></i> 多云转晴
                </div>
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div class="flex items-start gap-3">
                    <div
                      class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse"
                    >
                      <i class="pi pi-exclamation-triangle"></i>
                    </div>
                    <div>
                      <div class="font-bold">霜冻黄色预警 (24h后)</div>
                      <div class="text-sm opacity-80 mt-1">夜间气温骤降，建议覆盖地膜</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-32 px-4 relative">
      <div class="container mx-auto max-w-6xl">
        <div class="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div v-observe class="w-full md:w-1/2">
            <div
              class="inline-block px-3 py-1 mb-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold tracking-wider uppercase"
            >
              AI Identification
            </div>
            <h2
              class="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900 dark:text-white"
            >
              分不清<br />是<span class="text-emerald-500">宝</span>还是<span
              class="text-gray-400 dark:text-gray-600 decoration-gray-300 dark:decoration-gray-600 line-through"
            >草</span
            >？
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              地里长了不认识的植物？拿出手机拍一张，AI 瞬间识别植物名称，并告知其<span
              class="text-emerald-600 dark:text-emerald-500 font-bold"
            >生长习性与危害性</span
            >，帮您决定是铲除还是保留。
            </p>
          </div>
          <div v-observe class="w-full md:w-1/2 relative flex justify-center group">
            <div
              class="w-64 h-120 bg-gray-900 dark:bg-gray-800 rounded-[2.5rem] p-3 shadow-2xl dark:shadow-none border-4 border-gray-800 dark:border-gray-700 relative transform group-hover:scale-[1.02] transition-transform duration-500"
            >
              <div
                class="w-full h-full bg-gray-800 dark:bg-gray-900 rounded-4xl overflow-hidden relative"
              >
                <div class="absolute inset-0 bg-green-900/20 flex items-center justify-center">
                  <i class="pi pi-globe text-8xl text-emerald-500/20"></i>
                </div>
                <div
                  class="absolute top-0 left-0 w-full h-1/2 border-b-2 border-emerald-400 bg-linear-to-b from-transparent to-emerald-400/20 animate-scan"
                ></div>
                <div
                  class="absolute bottom-0 w-full bg-white dark:bg-gray-800 p-4 rounded-t-2xl transition-transform transform translate-y-0"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <div class="text-lg font-bold text-gray-800 dark:text-white">
                        稗草 (Echinochloa)
                      </div>
                      <div class="text-xs text-gray-400">禾本科 · 恶性杂草</div>
                    </div>
                    <div
                      class="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded text-xs font-bold"
                    >
                      有害
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                    与水稻、玉米争夺肥水，建议苗期及时铲除。
                  </div>
                </div>
              </div>
              <div
                class="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 dark:bg-gray-800 rounded-full z-20"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="py-20 md:py-32 px-4 relative bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800/50 transition-colors"
    >
      <div class="container mx-auto max-w-6xl">
        <div class="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
          <div v-observe class="w-full md:w-1/2">
            <div
              class="inline-block px-3 py-1 mb-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold tracking-wider uppercase"
            >
              Direct Store
            </div>
            <h2
              class="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900 dark:text-white"
            >
              拒绝假化肥，<br /><span class="text-purple-500">直连</span>源头工厂
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              严选正品化肥与种子，厂家直发到村。让每一分钱都花在<span
              class="text-purple-600 dark:text-purple-400 font-bold"
            >刀刃上</span
            >。支持损坏包赔，售后无忧。
            </p>
            <div class="flex gap-4 text-gray-600 dark:text-gray-300">
              <div
                class="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-sm font-bold"
              >
                <i class="pi pi-check text-purple-500 mr-2"></i>正品保障
              </div>
              <div
                class="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-sm font-bold"
              >
                <i class="pi pi-check text-purple-500 mr-2"></i>货到付款
              </div>
            </div>
          </div>
          <div v-observe class="w-full md:w-1/2 relative h-80 group">
            <div
              class="absolute top-0 right-10 w-64 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-700 transform rotate-3 group-hover:rotate-6 group-hover:translate-x-4 transition-all duration-500 z-10"
            >
              <div
                class="w-full h-32 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl mb-3 flex items-center justify-center text-4xl"
              >
                🌽
              </div>
              <div class="font-bold text-gray-800 dark:text-white">高产玉米种 - 金海5号</div>
              <div class="flex justify-between items-center mt-2">
                <div class="text-purple-600 dark:text-purple-400 font-black text-lg">¥ 45.00</div>
                <div
                  class="w-6 h-6 rounded-full bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center"
                >
                  <i class="pi pi-plus text-xs"></i>
                </div>
              </div>
            </div>
            <div
              class="absolute top-10 right-32 w-64 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-700 transform -rotate-6 group-hover:-rotate-12 group-hover:-translate-x-4 transition-all duration-500 z-0 opacity-90"
            >
              <div
                class="w-full h-32 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-3 flex items-center justify-center text-4xl"
              >
                🧪
              </div>
              <div class="font-bold text-gray-800 dark:text-white">复合肥 50kg/袋</div>
              <div class="flex justify-between items-center mt-2">
                <div class="text-purple-600 dark:text-purple-400 font-black text-lg">¥ 120.00</div>
                <div
                  class="w-6 h-6 rounded-full bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center"
                >
                  <i class="pi pi-plus text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 px-4">
      <div class="container mx-auto max-w-5xl text-center">
        <h3 class="text-2xl font-bold mb-12 text-gray-400">更多强大功能</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div
            class="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group cursor-pointer"
          >
            <i
              class="pi pi-map text-3xl text-orange-500 mb-4 block group-hover:scale-110 transition-transform"
            ></i>
            <h4 class="font-bold text-gray-800 dark:text-gray-200">农田档案</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">地块数据可视化</p>
          </div>
          <div
            class="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group cursor-pointer"
          >
            <i
              class="pi pi-bell text-3xl text-yellow-500 mb-4 block group-hover:scale-110 transition-transform"
            ></i>
            <h4 class="font-bold text-gray-800 dark:text-gray-200">农事提醒</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">关键农时自动推送</p>
          </div>
          <div
            class="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group cursor-pointer"
          >
            <i
              class="pi pi-megaphone text-3xl text-red-500 mb-4 block group-hover:scale-110 transition-transform"
            ></i>
            <h4 class="font-bold text-gray-800 dark:text-gray-200">政策直通车</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">补贴申领不错过</p>
          </div>
        </div>
      </div>
    </section>

    <footer
      class="relative bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-10 text-gray-500 dark:text-gray-400 text-sm transition-colors overflow-hidden"
    >
      <!-- Background Atmosphere -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">

        <!-- Soft field light -->
        <div
          class="
        absolute
        -top-32
        left-1/2
        -translate-x-1/2
        w-[500px]
        h-[300px]
        rounded-full
        bg-yellow-200/30
        dark:bg-yellow-500/10
        blur-3xl
      "
        ></div>


        <!-- Abstract corn field -->
        <svg
          class="
        absolute
        bottom-0
        left-0
        w-full
        h-40
        opacity-[0.08]
        dark:opacity-[0.12]
        text-green-700
      "
          fill="currentColor"
          preserveAspectRatio="none"
          viewBox="0 0 1200 200"
          xmlns="http://www.w3.org/2000/svg"
        >

          <g class="animate-[fieldWave_8s_ease-in-out_infinite]">

            <path
              d="
          M0 200
          C80 140 120 80 180 30
          C150 110 220 130 260 200

          C350 130 400 70 470 20
          C430 110 500 150 560 200

          C650 120 700 60 780 30
          C740 120 820 150 880 200

          C980 120 1040 80 1120 40
          C1080 130 1160 150 1200 200

          Z
          "
            />

          </g>

        </svg>


        <!-- Floating dust particles -->
        <div
          class="
        absolute
        bottom-20
        left-[20%]
        w-1.5
        h-1.5
        rounded-full
        bg-yellow-400/40
        blur-sm
        animate-pulse
      "
        ></div>

        <div
          class="
        absolute
        bottom-14
        right-[25%]
        w-2
        h-2
        rounded-full
        bg-green-400/30
        blur-sm
        animate-pulse
      "
        ></div>

      </div>


      <!-- Footer Content -->
      <div
        class="
      relative
      z-10
      container
      mx-auto
      px-6
      flex
      flex-col
      md:flex-row
      justify-between
      items-center
      gap-6
    "
      >

        <!-- Brand -->
        <div class="flex flex-col md:flex-row items-center gap-2 md:gap-4">

          <div
            class="
          flex
          items-center
          gap-2
          font-bold
          text-gray-700
          dark:text-gray-300
        "
          >
            <img
              :src="favicon"
              alt="icon"
              class="w-5 h-5 object-contain"
            />

            <span>
          田间助手
        </span>

          </div>


          <span class="hidden md:inline text-gray-300 dark:text-gray-700">
        |
      </span>


          <span>
        © 2026 Pastoral Assistant · 智慧农业，让种植更简单
      </span>

        </div>


        <!-- Developer -->
        <div class="text-center md:text-right">

          <p
            class="
          text-xs
          uppercase
          tracking-[0.25em]
          text-gray-400
        "
          >
            Designed & Developed by
          </p>


          <a
            class="
          inline-block
          mt-1
          font-semibold
          text-green-600
          dark:text-green-400
          hover:text-green-700
          dark:hover:text-green-300
          transition-colors
        "
            href="https://github.com/DawnightDreemurr"
            rel="noopener noreferrer"
            target="_blank"
          >
            DawnightDreemurr
          </a>


          <p class="text-xs mt-1 text-gray-400">
            From Code to Field 🌽
          </p>

        </div>

      </div>


    </footer>


  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import logoDark from '@/assets/logo_dark.svg'
import logoWhite from '@/assets/logo_white.svg'
import favicon from '@/assets/favicon.svg'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

const vObserve = {
  mounted: (el) => {
    el.classList.add(
      'opacity-0',
      'translate-y-12',
      'scale-95',
      'transition-all',
      'duration-1000',
      'ease-out'
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.remove(
                'opacity-0',
                'translate-y-12',
                'scale-95'
              )

              el.classList.add(
                'opacity-100',
                'translate-y-0',
                'scale-100'
              )
            }, 100)

            observer.unobserve(el)
          }
        })
      },
      {
        threshold: 0.15
      }
    )

    observer.observe(el)
  }
}
const themeStore = useThemeStore()
const authStore = useAuthStore()

const toast = useToast()


let timer = null
let failCount = 0


// 停止检测
const stopCheck = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}


// 后端检测
const checkBackend = async () => {

  const online = await authStore.checkServerStatus()


  if (online) {

    toast.add({
      severity: 'success',
      summary: '服务连接成功',
      detail: '后端服务已连接',
      life: 3000
    })


    stopCheck()

    return
  }


  failCount++


  if (failCount >= 20) {

    toast.add({
      severity: 'error',
      summary: '连接失败',
      detail: '无法连接后端服务，请稍后重试',
      life: 5000
    })


    stopCheck()
  }

}


onMounted(() => {

  // 立即检测一次
  checkBackend()


  // 每秒检测
  timer = setInterval(() => {
    checkBackend()
  }, 1000)

})


onUnmounted(() => {

  stopCheck()

})

</script>

<style scoped>
@keyframes scan {
  0% {
    top: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 50%;
    opacity: 0;
  }
}

.animate-scan {
  animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fieldWave {
  0%,
  100% {
    transform: translateX(0px);
  }

  50% {
    transform: translateX(-20px);
  }
}
</style>

