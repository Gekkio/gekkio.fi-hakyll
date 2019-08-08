{-# LANGUAGE OverloadedStrings #-}
import Control.Monad (liftM)
import Data.Monoid ((<>))
import Hakyll.Web.Sass (sassCompiler)
import Hakyll
import Text.Pandoc (WriterOptions, writerHtml5)

myWriterOptions :: WriterOptions
myWriterOptions = defaultHakyllWriterOptions
  { writerHtml5 = True }

main :: IO ()
main = hakyll $ do
  match "index.html" $ do
    route idRoute
    compile $ do
      posts <- recentFirst =<< loadAll "blog/*"
      let indexCtx = listField "posts" postCtx (return $ take 5 posts) <>
                     defaultContext

      getResourceBody
        >>= applyAsTemplate indexCtx
        >>= loadAndApplyTemplate "templates/default.html" indexCtx
        >>= relativizeUrls

  match "robots.txt" $ do
    route   idRoute
    compile copyFileCompiler

  match "publickey.gekkio@gekkio.fi.asc" $ do
    route   idRoute
    compile copyFileCompiler

  match "images/**" $ do
    route   idRoute
    compile copyFileCompiler

  match "js/*" $ do
    route   idRoute
    compile copyFileCompiler

  match "css/gekkio-fi.scss" $ do
    route $ constRoute "css/gekkio-fi.css"
    compile $ liftM (fmap compressCss) sassCompiler

  match "blog/*" $ do
    route $ setExtension "html"
    compile $ pandocCompilerWith defaultHakyllReaderOptions myWriterOptions
      >>= loadAndApplyTemplate "templates/post.html"    postCtx
      >>= loadAndApplyTemplate "templates/default.html" postCtx
      >>= relativizeUrls

  match "blog.html" $ do
    route $ constRoute "blog/index.html"
    compile $ do
      posts <- recentFirst =<< loadAll "blog/*"
      let postsCtx = listField "posts" postCtx (return posts) <>
                     defaultContext

      getResourceBody
        >>= applyAsTemplate postsCtx
        >>= loadAndApplyTemplate "templates/default.html" postsCtx
        >>= relativizeUrls

  match "templates/*" $ compile templateCompiler

  create ["sitemap.xml"] $ do
    route   idRoute
    compile $ do
      posts <- recentFirst =<< loadAll "blog/*"
      pages <- loadAll "*.html"
      let allPosts = return (pages ++ posts)
      let sitemapCtx = listField "entries" postCtx allPosts <>
                       defaultContext

      makeItem ""
        >>= loadAndApplyTemplate "templates/sitemap.xml" sitemapCtx
        >>= return . fmap (replaceAll pattern replacement)
          where
            pattern = "/index.html"
            replacement = const "/"

postCtx :: Context String
postCtx =
  dateField "date" "%B %e, %Y" <>
  modificationTimeField "lastmod" "%Y-%m-%d" <>
  defaultContext
