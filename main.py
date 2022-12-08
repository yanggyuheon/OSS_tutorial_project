import sys
import jellyfish # pip install jellyfish

lev_distance = sys.maxsize
select_dept = ""

# sys.argv[1] : dept 문자열, dept1,dept2,dept3 .. => dept1 / dept2 / ..  list로
dept_arr = sys.argv[1].split(',')

# 반복문 수행하면서 기존 distance보다 작으면 업데이트
for i in dept_arr:
    if( lev_distance >= jellyfish.levenshtein_distance(i, sys.argv[2])):
        lev_distance = jellyfish.levenshtein_distance(i, sys.argv[2]) # 업데이트
        select_dept = i

# 선택된 dept를 index.js에서 result.stdout.on을 이용해서 사용
print(select_dept)