require('dotenv').config();
const axios = require('axios');
const xml2js = require('xml2js'); 

const QUICKBASE_DOMAIN = process.env.QUICKBASE_DOMAIN;
const QUICKBASE_CONTENT_TABLE = process.env.QUICKBASE_CONTENT_TABLE;
const QUICKBASE_MESSAGES_TABLE = process.env.QUICKBASE_MESSAGES_TABLE;
const QB_USER_TOKEN = process.env.QB_USER_TOKEN;
const QB_API_TOKEN = process.env.QB_API_TOKEN;

class QbQueryService {
    async fetchData(query, clist) {
        const encodedQuery = encodeURIComponent(query);
        try {
            const response = await axios.get(`https://${QUICKBASE_DOMAIN}/db/${QUICKBASE_CONTENT_TABLE}?a=API_DoQuery&query=${encodedQuery}&clist=${clist}&slist=1&options=num-100`, {
                headers: {
                    'QB-Realm-Hostname': QUICKBASE_DOMAIN,
                    'Authorization': `QB-USER-TOKEN ${QB_USER_TOKEN}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data from Quickbase:', error);
            throw new Error('Failed to fetch data from Quickbase');
        }
    }

    async fetchMenuData() {
        const query = "{'20'.EX.'1'}"; // Adjusted query to get all items
        const clist = '6.7.8.9.14.11'; // The list of field IDs you want to retrieve

        try {
            const rawData = await this.fetchData(query, clist);
    
            // Parse the XML response
            const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
            const result = await parser.parseStringPromise(rawData);

            // Ensure records is always an array
            let records = result.qdbapi.record;
            if (!Array.isArray(records)) {
                records = [records];
            }

            // Map records to a more friendly structure
            const menuItems = records.map(record => ({
                id: record.menu_id,
                label: record.label,
                pageLink: record.page_link || '#', // Fallback to '#' if page_link is empty
                content: record.content,
                parentMenuId: record.parent_menu_id || null, // Set to null if parent_menu_id is empty
                children: [] // Initialize an empty array for children
            }));
            // Organize items into a hierarchy
            return this.buildMenuHierarchy(menuItems);
        } catch (error) {
            console.error('Error in fetchMenuData:', error);
            throw error;
        }
    }

    buildMenuHierarchy(items) {
        // Index items by ID for easy lookup
        const itemLookup = {};
        items.forEach(item => {
            itemLookup[item.id] = item;
        });

        // Assign items to their parents and build the hierarchy
        const topLevelItems = [];
        items.forEach(item => {
            if (item.parentMenuId && itemLookup[item.parentMenuId]) {
                // It's a child item
                itemLookup[item.parentMenuId].children.push(item);
            } else {
                // It's a top-level item
                topLevelItems.push(item);
            }
        });
        return topLevelItems; // This will be an array of the top-level menu items with nested children
    }

    async fetchContentById(id) {
        const query = `{'6'.EX.'${id}'}`; // Assuming '6' is the field ID for the menu ID
        const clist = '7.9'; // '9' for content and '7' for the label
      
        try {
          let response = await this.fetchData(query, clist);
          // Parse the XML response
          const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
          const result = await parser.parseStringPromise(response);
          
          let content = result.qdbapi.record?.content || 'Content not found';
          content = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
          let label = result.qdbapi.record?.label || 'Label not found';
          //console.log(content);
          //console.log(label);
          // Return both content and label
          return { content, label };
        } catch (error) {
          console.error('Error fetching data from Quickbase:', error);
          return { content: 'Content not found', label: 'Untitled' };
        }
      }
    // Inside QbQueryService.js

    async submitContactForm(formData) {
        // Assuming formData is an object containing name, email, and message
        // Adjust field IDs ('6', '7', '8') according to your QuickBase table's schema
    
        // URL encode the form data to be sent as query parameters
        const queryParameters = new URLSearchParams({
            '_fid_6': formData.name,
            '_fid_7': formData.email,
            '_fid_8': formData.message,
        }).toString();
    
        // Construct the API URL with the query parameters
        const apiUrl = `https://${QUICKBASE_DOMAIN}/db/${QUICKBASE_MESSAGES_TABLE}?a=API_AddRecord&${queryParameters}&apptoken=${QB_API_TOKEN}`;
    
        try {
            // The content type is set to application/json, but QuickBase might expect 'application/xml'
            const response = await axios.post(apiUrl, null, { // Sending null as body since the data is in the URL
                headers: {
                    'QB-Realm-Hostname': QUICKBASE_DOMAIN,
                    'Authorization': `QB-USER-TOKEN ${QB_USER_TOKEN}`,
                    'Content-Type': 'application/json', // This might need to be 'application/xml' for QuickBase
                }
            });
            return { success: true }
        } catch (error) {
            console.error('Error submitting contact form to QuickBase:', error);
            return { success: false, error: error.message };
        }
    }
    

}

module.exports = QbQueryService;
