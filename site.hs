{-# LANGUAGE OverloadedStrings #-}
import Data.Monoid ((<>))
import Hakyll

main :: IO ()
main = hakyll $ do
  match "images/*" $ do
    route   idRoute
    compile copyFileCompiler

  match "css/*" $ do
    route   idRoute
    compile compressCssCompiler

  match "blog/*" $ do
    route $ setExtension "html"
    compile $ pandocCompiler
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

  match "templates/*" $ compile templateCompiler

postCtx :: Context String
postCtx =
  dateField "date" "%B %e, %Y" <>
  defaultContext
