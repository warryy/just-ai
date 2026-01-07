#!/bin/bash
# ==============================================================================
# 脚本名称：add-gitkeep.sh
# 脚本功能：为当前目录下所有空的子目录自动创建空的 .gitkeep 文件
# 忽略目录：node_modules、dist、.git（前端项目常见无需追踪的目录）
# 适用系统：Linux/macOS（基于 Bash 环境，需确保 bash 版本 >= 4.0）
# 使用方式：
#   1. 赋予执行权限：chmod +x add-gitkeep.sh
#   2. 运行脚本：./add-gitkeep.sh
# 注意事项：
#   - 脚本会递归处理当前目录下所有嵌套的空目录
#   - 不会覆盖已存在的 .gitkeep 文件
#   - 支持包含空格、中文、特殊符号的目录名
# ==============================================================================

# -------------------------- 全局变量定义 --------------------------
# 定义颜色输出常量（增强终端输出的可读性）
# 红色：错误提示
RED='\033[0;31m'
# 绿色：成功提示
GREEN='\033[0;32m'
# 黄色：警告/提示信息
YELLOW='\033[1;33m'
# 重置颜色（恢复终端默认颜色）
NC='\033[0m'

# 统计变量初始化（用于记录脚本执行结果）
# 总计扫描到的空目录数量
total_empty_dirs=0
# 成功创建的 .gitkeep 文件数量
created_files=0
# 被忽略的空目录数量（node_modules/dist/.git 下的）
skipped_ignored_dirs=0

# -------------------------- 脚本入口逻辑 --------------------------
# 打印脚本启动信息
echo -e "${YELLOW}========== 开始扫描当前目录下的空文件夹 ==========${NC}"
# 输出当前扫描的根目录（方便确认执行路径）
echo "扫描根目录：$(pwd)"
echo -e "${YELLOW}=================================================${NC}"

# -------------------------- 核心遍历逻辑 --------------------------
# 使用 find 命令遍历目录，筛选条件说明：
# .                          ：从当前目录开始遍历
# -type d                    ：只匹配目录（排除文件）
# -empty                     ：只匹配空目录（无任何文件/子目录）
# -not -path "*/node_modules/*" ：排除 node_modules 目录及其所有子目录
# -not -path "*/dist/*"      ：排除 dist 目录及其所有子目录
# -not -path "*/.git/*"      ：排除 .git 目录及其所有子目录
# -print0                    ：用 null 字符分隔结果（处理含空格/特殊字符的目录名）
find . -type d -empty \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/.git/*" \
    -print0 | while IFS= read -r -d '' dir; do
    # IFS=      ：禁用行分隔符，确保目录名中的空格不被拆分
    # read -r   ：禁用反斜杠转义，保留目录名的原始格式
    # -d ''     ：以 null 字符作为读取结束符（配合 find -print0）

    # ---------------------- 单个空目录处理逻辑 ----------------------
    # 拼接当前空目录下的 .gitkeep 文件路径
    gitkeep_file="${dir}/.gitkeep"

    # 检查该目录下是否已存在 .gitkeep 文件（避免覆盖）
    if [ -f "$gitkeep_file" ]; then
        # 输出跳过提示（黄色）
        echo -e "${YELLOW}[跳过] 已存在 .gitkeep 文件：$gitkeep_file${NC}"
        # 空目录计数+1
        ((total_empty_dirs++))
        # 跳过当前循环，处理下一个目录
        continue
    fi

    # 创建空的 .gitkeep 文件（touch 命令默认创建空文件）
    touch "$gitkeep_file"

    # 检查文件创建是否成功（$? 是上一条命令的执行状态，0 表示成功）
    if [ $? -eq 0 ]; then
        # 输出成功提示（绿色）
        echo -e "${GREEN}[成功] 创建 .gitkeep 文件：$gitkeep_file${NC}"
        # 成功创建计数+1
        ((created_files++))
    else
        # 输出失败提示（红色）
        echo -e "${RED}[失败] 创建 .gitkeep 文件失败：$gitkeep_file${NC}"
    fi

    # 空目录计数+1（无论是否创建成功，都计入总空目录数）
    ((total_empty_dirs++))
done

# -------------------------- 忽略目录统计 --------------------------
# 统计被忽略的空目录数量（node_modules/dist/.git 下的空目录）
# find 命令说明：
# \( ... -o ... \) ：逻辑或，匹配任意一个条件
# wc -l            ：统计行数（即目录数量）
skipped_ignored_dirs=$(find . -type d \( -path "*/node_modules/*" -o -path "*/dist/*" -o -path "*/.git/*" \) -empty | wc -l)

# -------------------------- 执行结果汇总 --------------------------
echo -e "${YELLOW}========== 扫描完成！执行结果汇总 ==========${NC}"
echo -e "📊 总计空目录数（不含忽略目录）：${total_empty_dirs}"
echo -e "✅ 成功创建 .gitkeep 文件数：${created_files}"
echo -e "🚫 被忽略的空目录数（node_modules/dist/.git）：${skipped_ignored_dirs}"
echo -e "${YELLOW}===========================================${NC}"

# 脚本正常退出（返回值 0 表示执行成功）
exit 0