import defaultSettings from '@/settings'

const title = defaultSettings.title || 'HGH'

export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}