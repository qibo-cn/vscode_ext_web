import { TreeItem, TreeItemCollapsibleState, TreeDataProvider, Uri, window } from 'vscode';
import { join } from 'path';
import * as vscode from "vscode";

// 创建每一项 label 对应的图片名称
// 其实就是一个Map集合，用 ts 的写法
export let ITEM_ICON_MAP_DARLANG = new Map<string, string>([
    ['darwinlang文件', "imgs/file.png"]
    // ['转换与仿真',"imgs/simulate_run.png"],
    // ['测试添加',"imgs/simulate_run.png"]
]);


// 第一步：创建单项的节点(item)的类
export class TreeItemNodeDarLang extends TreeItem {

    constructor(
        // readonly 只可读
        public label: string,
        public children?:TreeItemNodeDarLang[],
        public readonly isRoot?:boolean
    ){
        super(label, children === undefined ? vscode.TreeItemCollapsibleState.None :
            vscode.TreeItemCollapsibleState.Expanded);
        this.children = children ? children : [];
        // this.contextValue = isRoot ? "TreeViewProviderContext":undefined;
        this.contextValue = label;
    }

    // command: 为每项添加点击事件的命令
    command = {
        title: this.label,          // 标题
        command: 'itemClick',       // 命令 ID
        // tooltip: this.label,        // 鼠标覆盖时的小小提示框
        arguments: [                // 向 registerCommand 传递的参数。
            this.label,             // 目前这里我们只传递一个 label
        ]
    };
    
    // iconPath： 为该项的图标因为我们是通过上面的 Map 获取的，所以我额外写了一个方法，放在下面
    iconPath = TreeItemNodeDarLang.getIconUriForLabel(this.label);

    // __filename：当前文件的路径
    // 重点讲解 Uri.file(join(__filename,'..', '..') 算是一种固定写法
    // Uri.file(join(__filename,'..','assert', ITEM_ICON_MAP.get(label)+''));   写成这样图标出不来
    // 所以小伙伴们就以下面这种写法编写
    static getIconUriForLabel(label: string):Uri {
        console.log("path:"+Uri.file(join(__filename,'..', "resources", ITEM_ICON_MAP_DARLANG.get(label)+'')).toString());
        return Uri.file(join(__filename,'..',"..","src", "resources", ITEM_ICON_MAP_DARLANG.get(label)+''));
    }
}



export class TreeViewProviderDarLang implements TreeDataProvider<TreeItemNodeDarLang>{
    // 自动弹出的可以暂不理会
    
    data: TreeItemNodeDarLang[];

    constructor(){
        this.data = [];
        // this.data = [new TreeItemNode("项目", [new TreeItemNode("数据", 
        // [new TreeItemNode("训练数据"), new TreeItemNode("测试数据"), new TreeItemNode("测试数据标签")]), new TreeItemNode("模型")])];
    }

    // 自动弹出
    // 获取树视图中的每一项 item,所以要返回 element
    getTreeItem(element: TreeItemNodeDarLang): TreeItem | Thenable<TreeItem> {
        return element;
    }

    // 自动弹出，但是我们要对内容做修改
    // 给每一项都创建一个 TreeItemNode
    getChildren(element?: TreeItemNodeDarLang | undefined): import("vscode").ProviderResult<TreeItemNodeDarLang[]> {

        if(element === undefined){
            return this.data;
        }else{
            return element.children;
        }
        // return ['新建项目','导入数据','导入模型','转换与仿真'].map(
        
        //     item => new TreeItemNode(
        //         item as string,
        //         TreeItemCollapsibleState.None as TreeItemCollapsibleState,
        //     )
        // );
    }

    private _onDidChangeTreeData: vscode.EventEmitter<TreeItemNodeDarLang | undefined | null | void> = new vscode.EventEmitter<TreeItemNodeDarLang | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItemNodeDarLang | undefined | null | void> = this._onDidChangeTreeData.event;
  
    refresh(): void {
      this._onDidChangeTreeData.fire();
    }

    // 这个静态方法时自己写的，你要写到 extension.ts 也可以
    public static initTreeViewItem():TreeViewProviderDarLang{
    
        // 实例化 TreeViewProvider
        const treeViewProvider = new TreeViewProviderDarLang();
        
        // registerTreeDataProvider：注册树视图
        // 你可以类比 registerCommand(上面注册 Hello World)
        window.registerTreeDataProvider('item_darwinLang_convertor',treeViewProvider);
        return treeViewProvider;
    }
}
