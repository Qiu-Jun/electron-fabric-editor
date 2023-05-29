import '@antv/x6-vue-shape'
import { Graph } from '@antv/x6'
import { Dnd } from '@antv/x6-plugin-dnd'

const ports = {
    groups: {
        // 输入链接桩群组定义
        top: {
            position: 'top',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#2D8CF0',
                    strokeWidth: 2,
                    fill: '#fff'
                }
            }
        },
        // 输出链接桩群组定义
        bottom: {
            position: 'bottom',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#2D8CF0',
                    strokeWidth: 2,
                    fill: '#fff'
                }
            }
        },
        left: {
            position: 'left',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#2D8CF0',
                    strokeWidth: 2,
                    fill: '#fff'
                }
            }
        },
        right: {
            position: 'right',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#2D8CF0',
                    strokeWidth: 2,
                    fill: '#fff'
                }
            }
        }
    },
    items: [
        {
            id: 'port-top',
            group: 'top'
        },
        {
            id: 'port-bottom',
            group: 'bottom'
        },
        {
            id: 'port-left',
            group: 'left'
        },
        {
            id: 'port-right',
            group: 'right'
        }
    ]
}

const rectNode = (graph: Graph) =>
    graph.createNode({
        width: 100,
        height: 60,
        attrs: {
            label: {
                text: '正方形节点',
                fill: '#000000',
                fontSize: 14,
                textWrap: {
                    width: -10,
                    height: -10,
                    ellipsis: true
                }
            },
            body: {
                stroke: '#000000',
                strokeWidth: 1,
                fill: '#ffffff'
            }
        },
        ports: ports
    })

const circleNode = (graph: Graph) =>
    graph.createNode({
        shape: 'ellipse',
        width: 100,
        height: 100,
        attrs: {
            label: {
                text: '圆形节点',
                fill: '#000000',
                fontSize: 14,
                textWrap: {
                    width: -20,
                    height: -10,
                    ellipsis: true
                }
            },
            body: {
                stroke: '#000000',
                strokeWidth: 1,
                fill: '#ffffff'
            }
        },
        ports: ports
    })

const roteReactNode = (graph: Graph) =>
    graph.createNode({
        shape: 'polygon',
        x: 40,
        y: 40,
        width: 120,
        height: 120,
        attrs: {
            label: {
                text: '条件节点',
                fill: '#000000',
                fontSize: 14,
                textWrap: {
                    width: -50,
                    height: '70%',
                    ellipsis: true
                }
            },
            body: {
                fill: '#ffffff',
                stroke: '#000000',
                refPoints: '0,10 10,0 20,10 10,20',
                strokeWidth: 1
            }
        },
        ports: ports
    })

function drag2Graph(graph: Graph, type: string, e: MouseEvent) {
    if (!graph || !type) throw new Error('参数错误')
    let node = null
    // 待策略优化
    if (type === 'rect') {
        node = rectNode(graph)
    } else if (type === 'circle') {
        node = circleNode(graph)
    } else if (type === 'roteRect') {
        node = roteReactNode(graph)
    }
    if (!node) return
    const dnd = new Dnd({ target: graph })
    dnd.start(node, e)
}

export default drag2Graph
