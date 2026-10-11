import psycopg2
conn = psycopg2.connect(
    user="postgres",
    password="220674Hbd",
    host="localhost",
    port="5432",
    dbname="mrgSD_jwellery"
)
cur = conn.cursor()
cur.execute("SELECT id, name FROM collections")
print(cur.fetchall())
