import { chromium } from "playwright";
import { createServer } from "vite";

const port = 4600 + Math.floor(Math.random() * 1000);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

let server;

try {
  server = await createServer({
    logLevel: "silent",
    server: { host: "127.0.0.1", port, strictPort: true },
  });
  await server.listen();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failedRequests = [];
  const badResponses = [];

  page.on("requestfailed", (request) => {
    failedRequests.push(`${request.url()} ${request.failure()?.errorText ?? "failed"}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" });

  const documentMeta = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    favicon: document.querySelector('link[rel="icon"]')?.getAttribute("href"),
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
    ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
  }));
  assert(documentMeta.lang === "ar", `Expected Arabic document language, got ${documentMeta.lang}.`);
  assert(documentMeta.dir === "rtl", `Expected RTL document direction, got ${documentMeta.dir}.`);
  assert(documentMeta.title.includes("Thought Creators"), `Expected brand in page title, got ${documentMeta.title}.`);
  assert(documentMeta.title.includes("فكر المبدعون"), `Expected Arabic brand in page title, got ${documentMeta.title}.`);
  assert(documentMeta.description?.includes("تصميم وتنفيذ"), "Expected Arabic SEO description.");
  assert(documentMeta.canonical === "https://tcs.sa/", `Expected canonical https://tcs.sa/, got ${documentMeta.canonical}.`);
  assert(documentMeta.favicon === "/assets/brand/logo-mark.png", `Expected favicon to use logo mark, got ${documentMeta.favicon}.`);
  assert(documentMeta.ogTitle?.includes("Thought Creators"), "Expected Open Graph title.");
  assert(documentMeta.ogUrl === "https://tcs.sa/", `Expected Open Graph URL https://tcs.sa/, got ${documentMeta.ogUrl}.`);

  const sceneCount = await page.locator(".scene").count();
  assert(sceneCount >= 5, `Expected at least 5 storytelling scenes, found ${sceneCount}.`);

  const projectCount = await page.locator(".project-card").count();
  assert(projectCount >= 4, `Expected at least 4 interactive project cards, found ${projectCount}.`);

  const orbitSceneCount = await page.locator(".brand-orbit").count();
  assert(orbitSceneCount === 1, `Expected one interactive brand orbit scene, found ${orbitSceneCount}.`);

  const orbitCardCount = await page.locator(".orbit-card").count();
  assert(orbitCardCount === 4, `Expected 4 orbit cards, found ${orbitCardCount}.`);

  const orbImage = page.locator(".hero-orb-image");
  await orbImage.waitFor({ state: "visible" });
  const orbState = await orbImage.evaluate((node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return {
      src: node.getAttribute("src"),
      objectFit: style.objectFit,
      width: rect.width,
      background: style.backgroundColor,
      borderStyle: style.borderStyle,
      boxShadow: style.boxShadow,
      position: style.position,
      zIndex: style.zIndex,
    };
  });
  assert(orbState.src === "/assets/thought-creators-orb.png", `Expected provided PNG orb asset, got ${orbState.src}.`);
  assert(orbState.objectFit === "contain", `Expected orb image object-fit contain, got ${orbState.objectFit}.`);
  assert(orbState.width >= 320 && orbState.width <= 420, `Expected desktop orb width between 320 and 420px, got ${orbState.width}.`);
  assert(orbState.background === "rgba(0, 0, 0, 0)", "Expected orb image to be transparent with no CSS background.");
  assert(orbState.borderStyle === "none", `Expected orb image to have no border, got ${orbState.borderStyle}.`);
  assert(orbState.boxShadow === "none", "Expected orb image not to recreate the orb with CSS shadow.");
  assert(orbState.position === "absolute", `Expected orb image to be the positioned center element, got ${orbState.position}.`);
  assert(orbState.zIndex === "3", `Expected orb image z-index 3, got ${orbState.zIndex}.`);
  const orbCornerAlpha = await page.evaluate(async () => {
    const image = document.querySelector(".hero-orb-image");
    const probe = new Image();
    probe.src = image.currentSrc;
    await probe.decode();
    const canvas = document.createElement("canvas");
    canvas.width = probe.naturalWidth;
    canvas.height = probe.naturalHeight;
    const context = canvas.getContext("2d");
    context.drawImage(probe, 0, 0);
    return context.getImageData(0, 0, 1, 1).data[3];
  });
  assert(orbCornerAlpha < 10, `Expected transparent orb image corners, got alpha ${orbCornerAlpha}.`);

  const orbitCard = page.locator(".orbit-card").first();
  await orbitCard.hover({ force: true });
  await page.waitForTimeout(400);
  const orbitHoverState = await orbitCard.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      boxShadow: style.boxShadow,
      transform: style.transform,
    };
  });
  assert(orbitHoverState.boxShadow !== "none", "Expected orbit cards to glow on hover.");
  assert(orbitHoverState.transform !== "none", "Expected orbit cards to lift on hover.");

  const serviceCount = await page.locator(".service-card").count();
  assert(serviceCount === 6, `Expected the 6 original service cards, found ${serviceCount}.`);

  const packageCount = await page.locator(".package-card").count();
  assert(packageCount === 5, `Expected the 5 original package cards, found ${packageCount}.`);

  await page.locator("#packages").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const detailedPackageItemCount = await page.locator(".package-card__item").count();
  assert(detailedPackageItemCount >= 16, `Expected detailed package inclusions/options, found ${detailedPackageItemCount}.`);

  const packageCtaCount = await page.locator(".package-card__cta").count();
  assert(packageCtaCount === 5, `Expected every package card to include a contact CTA, found ${packageCtaCount}.`);

  const packageOptionPanelCount = await page.locator(".package-card__options").count();
  assert(packageOptionPanelCount === 2, `Expected execution/event package option panels, found ${packageOptionPanelCount}.`);

  const featuredPackageCount = await page.locator(".package-card--featured").count();
  assert(featuredPackageCount === 1, `Expected one featured package card, found ${featuredPackageCount}.`);

  await page.getByText("مخططات ثنائية الأبعاد (2D)").waitFor({ state: "visible" });
  await page.getByText("تصميم التغليف (Packaging)").waitFor({ state: "visible" });
  await page.getByText("تنفيذ غير شامل المواد").waitFor({ state: "visible" });
  await page.getByText("إدارة الفعالية فقط").waitFor({ state: "visible" });
  await page.getByText("هل تحتاج مساعدة في الاختيار؟").waitFor({ state: "visible" });

  await page.getByText("نصنع الأفكار التي تترك أثراً").waitFor({ state: "visible" });
  await page.getByText("نحوّل أفكارك إلى تجارب لا تُنسى").waitFor({ state: "attached" });
  const secondaryWhatsappCount = await page.getByText("0540995592").count();
  assert(secondaryWhatsappCount >= 1, "Expected secondary WhatsApp number to remain available.");

  const eyebrowStyle = await page.locator(".eyebrow").first().evaluate((node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return {
      height: rect.height,
      fontSize: Number.parseFloat(style.fontSize),
      backdropFilter: style.backdropFilter || style.webkitBackdropFilter,
      boxShadow: style.boxShadow,
    };
  });
  assert(eyebrowStyle.height >= 48, `Expected Apple-glass eyebrow height >= 48px, got ${eyebrowStyle.height}.`);
  assert(eyebrowStyle.fontSize >= 17, `Expected larger eyebrow text, got ${eyebrowStyle.fontSize}px.`);
  assert(eyebrowStyle.backdropFilter.includes("blur"), "Expected eyebrow to use frosted glass blur.");
  assert(eyebrowStyle.boxShadow !== "none", "Expected eyebrow to have glass depth shadow.");

  const chapterWatermark = await page.locator(".scene").first().evaluate((node) => {
    const style = getComputedStyle(node, "::before");
    return {
      opacity: Number.parseFloat(style.opacity),
      top: Number.parseFloat(style.top),
      zIndex: style.zIndex,
    };
  });
  assert(
    chapterWatermark.opacity >= 0.12 && chapterWatermark.opacity <= 0.18,
    `Expected visible-but-subtle chapter number opacity, got ${chapterWatermark.opacity}.`,
  );
  assert(chapterWatermark.top >= 80 && chapterWatermark.top <= 120, `Expected chapter number in upper-left safe area, got ${chapterWatermark.top}px.`);
  assert(chapterWatermark.zIndex === "0", `Expected chapter number behind content at z-index 0, got ${chapterWatermark.zIndex}.`);

  const canvasCount = await page.locator(".webgl-bg canvas").count();
  assert(canvasCount === 1, `Expected one Three.js canvas, found ${canvasCount}.`);

  const centerPixel = await page.locator(".webgl-bg canvas").evaluate((canvas) => {
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const pixel = new Uint8Array(4);
    gl.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    return Array.from(pixel);
  });
  const smokePixel = await page.locator(".webgl-bg canvas").evaluate((canvas) => {
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const pixel = new Uint8Array(4);
    gl.readPixels(Math.floor(canvas.width * 0.75), Math.floor(canvas.height * 0.65), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    return Array.from(pixel);
  });
  const maxChannel = Math.max(centerPixel[0], centerPixel[1], centerPixel[2]);
  const averageChannel = (centerPixel[0] + centerPixel[1] + centerPixel[2]) / 3;
  const smokeAverage = (smokePixel[0] + smokePixel[1] + smokePixel[2]) / 3;
  assert(maxChannel < 238, `Expected cursor glow to stay subtle, got RGB ${centerPixel.slice(0, 3).join(", ")}.`);
  assert(averageChannel <= 100, `Expected darker painted background, got average RGB ${averageChannel.toFixed(1)}.`);
  assert(smokeAverage <= 95, `Expected darker smoke field, got average RGB ${smokeAverage.toFixed(1)}.`);

  const firstCard = page.locator(".project-card").first();
  await firstCard.hover();
  await firstCard.locator(".project-card__meta").waitFor({ state: "visible" });
  const firstCardHandle = await firstCard.elementHandle();
  const revealVisible = await page.waitForFunction(
    (card) => {
      const meta = card.querySelector(".project-card__meta");
      return Number.parseFloat(getComputedStyle(meta).opacity) > 0.9;
    },
    firstCardHandle,
  );
  assert(revealVisible, "Expected project metadata to be visible after hover.");

  await firstCard.focus();
  const focusedClass = await firstCard.evaluate((node) => node.matches(":focus-visible") || node.matches(":focus"));
  assert(focusedClass, "Expected project card to be keyboard focusable.");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "load" });
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert(mobileOverflow <= 2, `Expected no mobile horizontal overflow, got ${mobileOverflow}px.`);

  assert(failedRequests.length === 0, `Expected no failed asset requests, got: ${failedRequests.join(", ")}`);
  assert(badResponses.length === 0, `Expected no 4xx/5xx responses, got: ${badResponses.join(", ")}`);

  await browser.close();
} finally {
  if (server) {
    await server.close();
  }
}
