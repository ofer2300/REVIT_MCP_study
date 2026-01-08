/**
 * Revit MCP 工具定義
 * 定義可供 AI 呼叫的 Revit 操作工具
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { RevitSocketClient } from "../socket.js";

/**
 * 註冊所有 Revit 工具
 */
export function registerRevitTools(): Tool[] {
    return [
        // 1. 建立牆元素
        {
            name: "create_wall",
            description: "在 Revit 中建立一面牆。需要指定起點、終點座標和高度。",
            inputSchema: {
                type: "object",
                properties: {
                    startX: {
                        type: "number",
                        description: "起點 X 座標（公釐）",
                    },
                    startY: {
                        type: "number",
                        description: "起點 Y 座標（公釐）",
                    },
                    endX: {
                        type: "number",
                        description: "終點 X 座標（公釐）",
                    },
                    endY: {
                        type: "number",
                        description: "終點 Y 座標（公釐）",
                    },
                    height: {
                        type: "number",
                        description: "牆高度（公釐）",
                        default: 3000,
                    },
                    wallType: {
                        type: "string",
                        description: "牆類型名稱（選填）",
                    },
                },
                required: ["startX", "startY", "endX", "endY"],
            },
        },

        // 2. 查詢專案資訊
        {
            name: "get_project_info",
            description: "取得目前開啟的 Revit 專案基本資訊，包括專案名稱、建築物名稱、業主等。",
            inputSchema: {
                type: "object",
                properties: {},
            },
        },

        // 3. 查詢元素
        {
            name: "query_elements",
            description: "查詢 Revit 專案中的元素。可依類別、族群、類型等條件篩選。",
            inputSchema: {
                type: "object",
                properties: {
                    category: {
                        type: "string",
                        description: "元素類別（如：牆、門、窗等）",
                    },
                    family: {
                        type: "string",
                        description: "族群名稱（選填）",
                    },
                    type: {
                        type: "string",
                        description: "類型名稱（選填）",
                    },
                    level: {
                        type: "string",
                        description: "樓層名稱（選填）",
                    },
                },
            },
        },

        // 4. 建立樓板
        {
            name: "create_floor",
            description: "在 Revit 中建立樓板。需要指定矩形範圍的四個角點座標。",
            inputSchema: {
                type: "object",
                properties: {
                    points: {
                        type: "array",
                        description: "樓板邊界點陣列，每個點包含 x, y 座標（公釐）",
                        items: {
                            type: "object",
                            properties: {
                                x: { type: "number" },
                                y: { type: "number" },
                            },
                        },
                    },
                    levelName: {
                        type: "string",
                        description: "樓層名稱",
                        default: "Level 1",
                    },
                    floorType: {
                        type: "string",
                        description: "樓板類型名稱（選填）",
                    },
                },
                required: ["points"],
            },
        },

        // 5. 刪除元素
        {
            name: "delete_element",
            description: "依 Element ID 刪除 Revit 元素。",
            inputSchema: {
                type: "object",
                properties: {
                    elementId: {
                        type: "number",
                        description: "要刪除的元素 ID",
                    },
                },
                required: ["elementId"],
            },
        },

        // 6. 取得元素資訊
        {
            name: "get_element_info",
            description: "取得指定元素的詳細資訊，包括參數、幾何資訊等。",
            inputSchema: {
                type: "object",
                properties: {
                    elementId: {
                        type: "number",
                        description: "元素 ID",
                    },
                },
                required: ["elementId"],
            },
        },

        // 7. 修改元素參數
        {
            name: "modify_element_parameter",
            description: "修改 Revit 元素的參數值。",
            inputSchema: {
                type: "object",
                properties: {
                    elementId: {
                        type: "number",
                        description: "元素 ID",
                    },
                    parameterName: {
                        type: "string",
                        description: "參數名稱",
                    },
                    value: {
                        type: "string",
                        description: "新的參數值",
                    },
                },
                required: ["elementId", "parameterName", "value"],
            },
        },

        // 8. 取得所有樓層
        {
            name: "get_all_levels",
            description: "取得專案中所有樓層的清單，包括樓層名稱和標高。",
            inputSchema: {
                type: "object",
                properties: {},
            },
        },

        // 9. 建立門
        {
            name: "create_door",
            description: "在指定的牆上建立門。",
            inputSchema: {
                type: "object",
                properties: {
                    wallId: {
                        type: "number",
                        description: "要放置門的牆 ID",
                    },
                    locationX: {
                        type: "number",
                        description: "門在牆上的位置 X 座標（公釐）",
                    },
                    locationY: {
                        type: "number",
                        description: "門在牆上的位置 Y 座標（公釐）",
                    },
                    doorType: {
                        type: "string",
                        description: "門類型名稱（選填）",
                    },
                },
                required: ["wallId", "locationX", "locationY"],
            },
        },

        // 10. 建立窗
        {
            name: "create_window",
            description: "在指定的牆上建立窗。",
            inputSchema: {
                type: "object",
                properties: {
                    wallId: {
                        type: "number",
                        description: "要放置窗的牆 ID",
                    },
                    locationX: {
                        type: "number",
                        description: "窗在牆上的位置 X 座標（公釐）",
                    },
                    locationY: {
                        type: "number",
                        description: "窗在牆上的位置 Y 座標（公釐）",
                    },
                    windowType: {
                        type: "string",
                        description: "窗類型名稱（選填）",
                    },
                },
                required: ["wallId", "locationX", "locationY"],
            },
        },

        // 11. 取得所有網格線
        {
            name: "get_all_grids",
            description: "取得專案中所有網格線（Grid）的資訊，包含名稱、方向、起點和終點座標。可用於計算網格交會點。",
            inputSchema: {
                type: "object",
                properties: {},
            },
        },

        // 12. 取得柱類型
        {
            name: "get_column_types",
            description: "取得專案中所有可用的柱類型，包含名稱、尺寸和族群資訊。",
            inputSchema: {
                type: "object",
                properties: {
                    material: {
                        type: "string",
                        description: "篩選材質（如：混凝土、鋼），選填",
                    },
                },
            },
        },

        // 13. 建立柱子
        {
            name: "create_column",
            description: "在指定位置建立柱子。需要指定座標和底部樓層。",
            inputSchema: {
                type: "object",
                properties: {
                    x: {
                        type: "number",
                        description: "柱子位置 X 座標（公釐）",
                    },
                    y: {
                        type: "number",
                        description: "柱子位置 Y 座標（公釐）",
                    },
                    bottomLevel: {
                        type: "string",
                        description: "底部樓層名稱",
                        default: "Level 1",
                    },
                    topLevel: {
                        type: "string",
                        description: "頂部樓層名稱（選填，如不指定則使用非約束高度）",
                    },
                    columnType: {
                        type: "string",
                        description: "柱類型名稱（選填，如不指定則使用預設類型）",
                    },
                },
                required: ["x", "y"],
            },
        },

        // 14. 取得家具類型
        {
            name: "get_furniture_types",
            description: "取得專案中已載入的家具類型清單，包含名稱和族群資訊。",
            inputSchema: {
                type: "object",
                properties: {
                    category: {
                        type: "string",
                        description: "家具類別篩選（如：椅子、桌子、床），選填",
                    },
                },
            },
        },

        // 15. 放置家具
        {
            name: "place_furniture",
            description: "在指定位置放置家具實例。",
            inputSchema: {
                type: "object",
                properties: {
                    x: {
                        type: "number",
                        description: "X 座標（公釐）",
                    },
                    y: {
                        type: "number",
                        description: "Y 座標（公釐）",
                    },
                    furnitureType: {
                        type: "string",
                        description: "家具類型名稱（需與 get_furniture_types 回傳的名稱一致）",
                    },
                    level: {
                        type: "string",
                        description: "樓層名稱",
                        default: "Level 1",
                    },
                    rotation: {
                        type: "number",
                        description: "旋轉角度（度），預設 0",
                        default: 0,
                    },
                },
                required: ["x", "y", "furnitureType"],
            },
        },

        // 16. 取得房間資訊
        {
            name: "get_room_info",
            description: "取得房間詳細資訊，包含中心點座標和邊界範圍。可用於智慧放置家具。",
            inputSchema: {
                type: "object",
                properties: {
                    roomId: {
                        type: "number",
                        description: "房間 Element ID（選填，如果知道的話）",
                    },
                    roomName: {
                        type: "string",
                        description: "房間名稱（選填，用於搜尋）",
                    },
                },
            },
        },

        // 17. 取得樓層房間清單
        {
            name: "get_rooms_by_level",
            description: "取得指定樓層的所有房間清單，包含名稱、編號、面積、用途等資訊。可用於容積檢討。",
            inputSchema: {
                type: "object",
                properties: {
                    level: {
                        type: "string",
                        description: "樓層名稱（如：1F、Level 1）",
                    },
                    includeUnnamed: {
                        type: "boolean",
                        description: "是否包含未命名的房間，預設 true",
                        default: true,
                    },
                },
                required: ["level"],
            },
        },

        // 18. 取得所有視圖
        {
            name: "get_all_views",
            description: "取得專案中所有視圖的清單，包含平面圖、天花圖、3D視圖、剖面圖等。可用於選擇要標註的視圖。",
            inputSchema: {
                type: "object",
                properties: {
                    viewType: {
                        type: "string",
                        description: "視圖類型篩選：FloorPlan（平面圖）、CeilingPlan（天花圖）、ThreeD（3D視圖）、Section（剖面圖）、Elevation（立面圖）",
                    },
                    levelName: {
                        type: "string",
                        description: "樓層名稱篩選（選填）",
                    },
                },
            },
        },

        // 19. 取得目前視圖
        {
            name: "get_active_view",
            description: "取得目前開啟的視圖資訊，包含視圖名稱、類型、樓層等。",
            inputSchema: {
                type: "object",
                properties: {},
            },
        },

        // 20. 切換視圖
        {
            name: "set_active_view",
            description: "切換至指定的視圖。",
            inputSchema: {
                type: "object",
                properties: {
                    viewId: {
                        type: "number",
                        description: "要切換的視圖 Element ID",
                    },
                },
                required: ["viewId"],
            },
        },

        // 21. 選取元素
        {
            name: "select_element",
            description: "在 Revit 中選取指定的元素，讓使用者可以視覺化確認目標元素。",
            inputSchema: {
                type: "object",
                properties: {
                    elementId: {
                        type: "number",
                        description: "要選取的元素 ID (單選)",
                    },
                    elementIds: {
                        type: "array",
                        items: { type: "number" },
                        description: "要選取的元素 ID 列表 (多選)",
                    },
                },
                // required: ["elementId"], // 讓後端驗證
            },
        },

        // 22. 縮放至元素
        {
            name: "zoom_to_element",
            description: "將視圖縮放至指定元素，讓使用者可以快速定位。",
            inputSchema: {
                type: "object",
                properties: {
                    elementId: {
                        type: "number",
                        description: "要縮放至的元素 ID",
                    },
                },
                required: ["elementId"],
            },
        },

        // 23. 測量距離
        {
            name: "measure_distance",
            description: "測量兩個點之間的距離。回傳距離（公釐）。",
            inputSchema: {
                type: "object",
                properties: {
                    point1X: {
                        type: "number",
                        description: "第一點 X 座標（公釐）",
                    },
                    point1Y: {
                        type: "number",
                        description: "第一點 Y 座標（公釐）",
                    },
                    point1Z: {
                        type: "number",
                        description: "第一點 Z 座標（公釐），預設 0",
                        default: 0,
                    },
                    point2X: {
                        type: "number",
                        description: "第二點 X 座標（公釐）",
                    },
                    point2Y: {
                        type: "number",
                        description: "第二點 Y 座標（公釐）",
                    },
                    point2Z: {
                        type: "number",
                        description: "第二點 Z 座標（公釐），預設 0",
                        default: 0,
                    },
                },
                required: ["point1X", "point1Y", "point2X", "point2Y"],
            },
        },

        // 24. 取得牆資訊
        {
            name: "get_wall_info",
            description: "取得牆的詳細資訊，包含厚度、長度、高度、位置線座標等。用於計算走廊淨寬。",
            inputSchema: {
                type: "object",
                properties: {
                    wallId: {
                        type: "number",
                        description: "牆的 Element ID",
                    },
                },
                required: ["wallId"],
            },
        },

        // 25. 建立尺寸標註
        {
            name: "create_dimension",
            description: "在指定視圖中建立尺寸標註。需要指定視圖和兩個參考點。",
            inputSchema: {
                type: "object",
                properties: {
                    viewId: {
                        type: "number",
                        description: "要建立標註的視圖 ID（使用 get_active_view 或 get_all_views 取得）",
                    },
                    startX: {
                        type: "number",
                        description: "起點 X 座標（公釐）",
                    },
                    startY: {
                        type: "number",
                        description: "起點 Y 座標（公釐）",
                    },
                    endX: {
                        type: "number",
                        description: "終點 X 座標（公釐）",
                    },
                    endY: {
                        type: "number",
                        description: "終點 Y 座標（公釐）",
                    },
                    offset: {
                        type: "number",
                        description: "標註線偏移距離（公釐），預設 500",
                        default: 500,
                    },
                },
                required: ["viewId", "startX", "startY", "endX", "endY"],
            },
        },

        // 25. 根據位置查詢牆體
        {
            name: "query_walls_by_location",
            description: "查詢指定座標附近的牆體，回傳牆厚度、位置線與牆面座標。",
            inputSchema: {
                type: "object",
                properties: {
                    x: {
                        type: "number",
                        description: "搜尋中心 X 座標",
                    },
                    y: {
                        type: "number",
                        description: "搜尋中心 Y 座標",
                    },
                    searchRadius: {
                        type: "number",
                        description: "搜尋半徑 (mm)",
                    },
                    level: {
                        type: "string",
                        description: "樓層名稱 (選填，例如 '2FL')",
                    },
                },
                required: ["x", "y", "searchRadius"],
            },
        },

        // 26. 通用元素查詢
        {
            name: "query_elements",
            description: "查詢視圖中的元素，可依照類別 (Category) 過濾。",
            inputSchema: {
                type: "object",
                properties: {
                    category: {
                        type: "string",
                        description: "元素類別 (例如 'Dimensions', 'Walls', 'Rooms', 'Windows')",
                    },
                    viewId: {
                        type: "number",
                        description: "視圖 ID (選填，若未提供則查詢目前視圖)",
                    },
                    maxCount: {
                        type: "number",
                        description: "最大回傳數量 (預設 100)",
                    },
                },
                required: ["category"],
            },
        },

        // 27. 覆寫元素圖形顯示
        {
            name: "override_element_graphics",
            description: "在指定視圖中覆寫元素的圖形顯示（填滿顏色、圖樣、線條顏色等）。適用於平面圖中標記不同狀態的牆體或其他元素。",
            inputSchema: {
                type: "object",
                properties: {
                    elementId: {
                        type: "number",
                        description: "要覆寫的元素 ID",
                    },
                    viewId: {
                        type: "number",
                        description: "視圖 ID（若不指定則使用當前視圖）",
                    },
                    surfaceFillColor: {
                        type: "object",
                        description: "表面填滿顏色 RGB (0-255)",
                        properties: {
                            r: { type: "number", minimum: 0, maximum: 255 },
                            g: { type: "number", minimum: 0, maximum: 255 },
                            b: { type: "number", minimum: 0, maximum: 255 },
                        },
                    },
                    surfacePatternId: {
                        type: "number",
                        description: "表面填充圖樣 ID（-1 表示使用實心填滿，0 表示不設定圖樣）",
                        default: -1,
                    },
                    lineColor: {
                        type: "object",
                        description: "線條顏色 RGB（可選）",
                        properties: {
                            r: { type: "number", minimum: 0, maximum: 255 },
                            g: { type: "number", minimum: 0, maximum: 255 },
                            b: { type: "number", minimum: 0, maximum: 255 },
                        },
                    },
                    transparency: {
                        type: "number",
                        description: "透明度 (0-100)，0 為不透明",
                        minimum: 0,
                        maximum: 100,
                        default: 0,
                    },
                },
                required: ["elementId"],
            },
        },

        // 28. 清除元素圖形覆寫
        {
            name: "clear_element_override",
            description: "清除元素在指定視圖中的圖形覆寫，恢復為預設顯示。",
            inputSchema: {
                type: "object",
                properties: {
                    elementId: {
                        type: "number",
                        description: "要清除覆寫的元素 ID",
                    },
                    elementIds: {
                        type: "array",
                        items: { type: "number" },
                        description: "要清除覆寫的元素 ID 列表（批次操作）",
                    },
                    viewId: {
                        type: "number",
                        description: "視圖 ID（若不指定則使用當前視圖）",
                    },
                },
            },
        },

        // =====================================================================
        // MEP / Fire Protection / Sprinkler Tools (AquaBrain Extension)
        // =====================================================================

        // 29. Get all pipe types
        {
            name: "get_pipe_types",
            description: "Get all available pipe types in the project, including name, material, and system classification (Sanitary, Domestic Hot Water, Fire Protection, etc.)",
            inputSchema: {
                type: "object",
                properties: {
                    systemClassification: {
                        type: "string",
                        description: "Filter by system classification: Sanitary, DomesticHotWater, DomesticColdWater, FireProtectionWet, FireProtectionDry, Hydronic, Other",
                    },
                },
            },
        },

        // 30. Query pipes by system
        {
            name: "query_pipes",
            description: "Query pipes in the project filtered by system type, level, or diameter. Returns pipe ID, diameter, length, system type, and connected elements.",
            inputSchema: {
                type: "object",
                properties: {
                    systemClassification: {
                        type: "string",
                        description: "System classification filter (e.g., 'FireProtectionWet', 'Sanitary')",
                    },
                    level: {
                        type: "string",
                        description: "Level name filter",
                    },
                    minDiameter: {
                        type: "number",
                        description: "Minimum diameter in mm",
                    },
                    maxDiameter: {
                        type: "number",
                        description: "Maximum diameter in mm",
                    },
                    maxCount: {
                        type: "number",
                        description: "Maximum number of results (default 100)",
                        default: 100,
                    },
                },
            },
        },

        // 31. Get pipe info
        {
            name: "get_pipe_info",
            description: "Get detailed information about a specific pipe including diameter, length, slope, flow, system type, and connected elements (fittings, equipment, sprinklers).",
            inputSchema: {
                type: "object",
                properties: {
                    pipeId: {
                        type: "number",
                        description: "The pipe Element ID",
                    },
                },
                required: ["pipeId"],
            },
        },

        // 32. Create pipe
        {
            name: "create_pipe",
            description: "Create a new pipe between two points. Specify system type, diameter, and level.",
            inputSchema: {
                type: "object",
                properties: {
                    startX: {
                        type: "number",
                        description: "Start point X coordinate (mm)",
                    },
                    startY: {
                        type: "number",
                        description: "Start point Y coordinate (mm)",
                    },
                    startZ: {
                        type: "number",
                        description: "Start point Z coordinate (mm)",
                    },
                    endX: {
                        type: "number",
                        description: "End point X coordinate (mm)",
                    },
                    endY: {
                        type: "number",
                        description: "End point Y coordinate (mm)",
                    },
                    endZ: {
                        type: "number",
                        description: "End point Z coordinate (mm)",
                    },
                    diameter: {
                        type: "number",
                        description: "Pipe diameter (mm)",
                        default: 25,
                    },
                    pipeType: {
                        type: "string",
                        description: "Pipe type name (optional)",
                    },
                    systemType: {
                        type: "string",
                        description: "System type name (e.g., 'Fire Protection Wet')",
                    },
                    level: {
                        type: "string",
                        description: "Level name",
                    },
                },
                required: ["startX", "startY", "startZ", "endX", "endY", "endZ"],
            },
        },

        // 33. Update pipe diameter
        {
            name: "update_pipe_diameter",
            description: "Update the diameter of one or more pipes. Can batch update multiple pipes at once.",
            inputSchema: {
                type: "object",
                properties: {
                    pipeId: {
                        type: "number",
                        description: "Single pipe Element ID",
                    },
                    pipeIds: {
                        type: "array",
                        items: { type: "number" },
                        description: "Array of pipe Element IDs for batch update",
                    },
                    diameter: {
                        type: "number",
                        description: "New diameter in mm",
                    },
                },
                required: ["diameter"],
            },
        },

        // 34. Get sprinkler types
        {
            name: "get_sprinkler_types",
            description: "Get all available sprinkler head types in the project, including name, K-factor, coverage area, and temperature rating.",
            inputSchema: {
                type: "object",
                properties: {
                    responseType: {
                        type: "string",
                        description: "Filter by response type: Standard, Quick, Extended Coverage",
                    },
                },
            },
        },

        // 35. Query sprinklers
        {
            name: "query_sprinklers",
            description: "Query sprinkler heads in the project filtered by level, type, or coverage status. Returns ID, location, type, connected pipe, and coverage area.",
            inputSchema: {
                type: "object",
                properties: {
                    level: {
                        type: "string",
                        description: "Level name filter",
                    },
                    sprinklerType: {
                        type: "string",
                        description: "Sprinkler type name filter",
                    },
                    room: {
                        type: "string",
                        description: "Room name or number filter",
                    },
                    maxCount: {
                        type: "number",
                        description: "Maximum number of results (default 200)",
                        default: 200,
                    },
                },
            },
        },

        // 36. Create sprinkler head
        {
            name: "create_sprinkler",
            description: "Place a sprinkler head at the specified location. Optionally connect to nearby pipe.",
            inputSchema: {
                type: "object",
                properties: {
                    x: {
                        type: "number",
                        description: "X coordinate (mm)",
                    },
                    y: {
                        type: "number",
                        description: "Y coordinate (mm)",
                    },
                    z: {
                        type: "number",
                        description: "Z coordinate (mm) - ceiling height",
                    },
                    sprinklerType: {
                        type: "string",
                        description: "Sprinkler type name",
                    },
                    level: {
                        type: "string",
                        description: "Level name",
                    },
                    connectToPipe: {
                        type: "boolean",
                        description: "Auto-connect to nearest pipe (default false)",
                        default: false,
                    },
                },
                required: ["x", "y"],
            },
        },

        // 37. Get MEP system info
        {
            name: "get_mep_system_info",
            description: "Get information about an MEP system (piping or duct), including total length, element count, and flow analysis.",
            inputSchema: {
                type: "object",
                properties: {
                    systemId: {
                        type: "number",
                        description: "MEP System Element ID",
                    },
                    systemName: {
                        type: "string",
                        description: "System name to search for",
                    },
                },
            },
        },

        // 38. Query MEP systems
        {
            name: "query_mep_systems",
            description: "Query all MEP systems in the project, optionally filtered by type (Piping, Duct, Electrical).",
            inputSchema: {
                type: "object",
                properties: {
                    systemType: {
                        type: "string",
                        description: "Filter by type: Piping, Duct, Electrical, All",
                        default: "All",
                    },
                    classification: {
                        type: "string",
                        description: "Filter by classification (e.g., 'FireProtection', 'Sanitary')",
                    },
                },
            },
        },

        // 39. Check MEP clashes
        {
            name: "check_mep_clashes",
            description: "Run clash detection between MEP elements and other categories (Structural, Architectural). Returns list of clashing elements.",
            inputSchema: {
                type: "object",
                properties: {
                    category1: {
                        type: "string",
                        description: "First category: Pipes, Ducts, CableTray, Conduit",
                        default: "Pipes",
                    },
                    category2: {
                        type: "string",
                        description: "Second category to check against: Structural, Walls, Floors, All",
                        default: "Structural",
                    },
                    level: {
                        type: "string",
                        description: "Limit to specific level (optional)",
                    },
                    tolerance: {
                        type: "number",
                        description: "Clash tolerance in mm (default 0)",
                        default: 0,
                    },
                },
            },
        },

        // 40. Route branch pipes
        {
            name: "route_branch_pipes",
            description: "Automatically route branch pipes from a main pipe to multiple sprinkler heads.",
            inputSchema: {
                type: "object",
                properties: {
                    mainPipeId: {
                        type: "number",
                        description: "Main pipe Element ID to branch from",
                    },
                    sprinklerIds: {
                        type: "array",
                        items: { type: "number" },
                        description: "Array of sprinkler Element IDs to connect",
                    },
                    branchDiameter: {
                        type: "number",
                        description: "Branch pipe diameter in mm",
                        default: 25,
                    },
                    dropHeight: {
                        type: "number",
                        description: "Vertical drop height from main to sprinkler in mm",
                        default: 300,
                    },
                },
                required: ["mainPipeId", "sprinklerIds"],
            },
        },

        // 41. Get linked models
        {
            name: "get_linked_models",
            description: "Get information about linked Revit models (Architecture, Structure, MEP disciplines).",
            inputSchema: {
                type: "object",
                properties: {},
            },
        },

        // 42. Query linked model elements
        {
            name: "query_linked_elements",
            description: "Query elements from linked models by category. Useful for coordination with Architecture or Structure.",
            inputSchema: {
                type: "object",
                properties: {
                    linkName: {
                        type: "string",
                        description: "Name of the linked model (partial match)",
                    },
                    category: {
                        type: "string",
                        description: "Element category to query (Walls, Floors, Ceilings, Rooms)",
                    },
                    level: {
                        type: "string",
                        description: "Filter by level name",
                    },
                    maxCount: {
                        type: "number",
                        description: "Maximum results (default 100)",
                        default: 100,
                    },
                },
                required: ["category"],
            },
        },

        // 43. Calculate hydraulic flow
        {
            name: "calculate_hydraulic_flow",
            description: "Calculate hydraulic flow for fire protection system using Hazen-Williams formula. Returns pressure drop and velocity.",
            inputSchema: {
                type: "object",
                properties: {
                    pipeIds: {
                        type: "array",
                        items: { type: "number" },
                        description: "Array of pipe Element IDs in flow path",
                    },
                    flowRate: {
                        type: "number",
                        description: "Flow rate in GPM",
                    },
                    cFactor: {
                        type: "number",
                        description: "Hazen-Williams C-factor (default 120 for steel)",
                        default: 120,
                    },
                },
                required: ["pipeIds", "flowRate"],
            },
        },

        // 44. Validate sprinkler coverage
        {
            name: "validate_sprinkler_coverage",
            description: "Validate sprinkler coverage per NFPA 13 requirements. Checks spacing, distance to walls, and coverage overlap.",
            inputSchema: {
                type: "object",
                properties: {
                    level: {
                        type: "string",
                        description: "Level to validate",
                    },
                    hazardClass: {
                        type: "string",
                        description: "Hazard classification: Light, Ordinary1, Ordinary2, ExtraHazard",
                        default: "Light",
                    },
                    maxSpacing: {
                        type: "number",
                        description: "Maximum sprinkler spacing in feet (NFPA 13)",
                        default: 15,
                    },
                },
                required: ["level"],
            },
        },

        // 45. Get fire protection summary
        {
            name: "get_fire_protection_summary",
            description: "Get a summary of fire protection elements in the project: sprinkler count, pipe length, system pressure, and compliance status.",
            inputSchema: {
                type: "object",
                properties: {
                    level: {
                        type: "string",
                        description: "Filter by level (optional, omit for whole project)",
                    },
                },
            },
        },
    ];
}

/**
 * 執行 Revit 工具
 */
export async function executeRevitTool(
    toolName: string,
    args: Record<string, any>,
    client: RevitSocketClient
): Promise<any> {
    // 將工具名稱轉換為 Revit 命令名稱
    const commandName = toolName;

    // 發送命令到 Revit
    const response = await client.sendCommand(commandName, args);

    if (!response.success) {
        throw new Error(response.error || "命令執行失敗");
    }

    return response.data;
}
