# Search Engine Management

The Metro Browser app now supports custom search engines and includes Ecosia as a built-in option.

## Built-in Search Engines

The app comes with the following search engines pre-configured:

- **Google** 🔍 - https://www.google.com/search?q={q}
- **Bing** 🔎 - https://www.bing.com/search?q={q}
- **Yahoo** 📧 - https://search.yahoo.com/search?p={q}
- **DuckDuckGo** 🦆 - https://www.duckduckgo.com/?q={q}
- **Ecosia** 🌱 - https://www.ecosia.org/search?q={q}

## Adding Custom Search Engines

### Through the App

1. Go to **Settings** → **manage search engines**
2. Tap **Add New Search Engine**
3. Fill in the form:
   - **Name**: Display name for the search engine
   - **URL**: Search URL with `{q}` placeholder for the query
   - **Icon**: Emoji or text icon (optional)
4. Tap **Add Search Engine**

### URL Format

Custom search engines must use the `{q}` placeholder in their URL. Examples:

```
https://www.example.com/search?query={q}
https://search.example.org/?q={q}&lang=en
https://example.net/find?term={q}
```

### Popular Search Engines to Add

- **Brave Search**: `https://search.brave.com/search?q={q}`
- **Startpage**: `https://www.startpage.com/sp/search?query={q}`
- **Qwant**: `https://www.qwant.com/?q={q}`
- **Searx**: `https://searx.be/?q={q}`

## Managing Search Engines

### View All Engines
- Go to **Settings** → **manage search engines**
- See all built-in and custom engines
- Built-in engines show "Default" label
- Custom engines show "Custom" label and can be deleted

### Set Default Engine
- Go to **Settings** → **Set Default Search Engine to**
- Choose from the dropdown list
- The selected engine will be used for all searches

### Delete Custom Engines
- Go to **Settings** → **manage search engines**
- Tap the trash icon (🗑️) next to any custom engine
- Confirm deletion

## Technical Details

### Storage
- Search engines are stored in AsyncStorage
- Default engines are built-in and cannot be deleted
- Custom engines are stored separately and can be modified

### URL Building
- The app replaces `{q}` with the URL-encoded search query
- Fallback to Google if engine not found
- Supports any search engine that uses query parameters

### Icons
- **Google**: 🔍 (magnifying glass)
- **Bing**: 🔎 (magnifying glass with tilt)
- **Yahoo**: 📧 (email envelope)
- **DuckDuckGo**: 🦆 (duck)
- **Ecosia**: 🌱 (sprout for environmental focus)
- Custom engines can use any emoji or text

## Privacy

- Search queries are sent directly to the selected search engine
- No search data is stored locally (except for browser history)
- Custom search engines should be privacy-focused alternatives 